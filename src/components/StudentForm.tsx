import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { encryptLevel1, decryptLevel1 } from '../utils/crypto';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface Student {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    address: string;
    course: string;
    password: string;
}

interface StudentListProps {
    onLogout: () => void;
}

export const StudentForm: React.FC<StudentListProps> = ({ onLogout }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | null>(null);
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState<Omit<Student, 'id'>>({
        fullName: '', email: '', phone: '', dob: '', gender: '', address: '', course: '', password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddModal = () => {
        setFormData({ fullName: '', email: '', phone: '', dob: '', gender: '', address: '', course: '', password: '' });
        setModalType('add');
    };

    const openEditModal = (student: Student) => {
        setCurrentStudent(student);
        setFormData({ ...student });
        setModalType('edit');
    };

    const openDeleteModal = (student: Student) => {
        setCurrentStudent(student);
        setModalType('delete');
    };

    const closeModal = () => setModalType(null);

    // Fetch students
    const fetchStudents = async () => {
        try {
            const res = await API.get('/students');
            const studentsData = res.data.map((stu: any) => {
                if (stu.payload) {
                    try {
                        const decryptedJson = decryptLevel1(stu.payload);
                        const studentObj = JSON.parse(decryptedJson);
                        return { id: stu.id, ...studentObj };
                    } catch {
                        return { id: stu.id, fullName: 'Decryption Error', email: '-', phone: '-', dob: '', gender: '-', course: '-', address: '-', password: '-' };
                    }
                } else {
                    return { id: stu.id, fullName: 'No Data', email: '-', phone: '-', dob: '', gender: '-', course: '-', address: '-', password: '-' };
                }
            });
            setStudents(studentsData);
        } catch (err) {
            console.error('❌ Fetch error:', err);
        }
    };

    useEffect(() => { fetchStudents(); }, []);

    const addStudent = async () => {
        const isEmpty = Object.values(formData).some(value => !value.trim());
        if (isEmpty) {
            toast.error('❌ Please fill in all fields before adding a student');
            return;
        }

        try {
            const jsonData = JSON.stringify(formData);
            const level1EncryptedPayload = encryptLevel1(jsonData);
            await API.post('/register', { payload: level1EncryptedPayload });
            fetchStudents();
            closeModal();
            toast.success('✅ Student added successfully');
        } catch {
            toast.error('❌ Error adding student');
        }
    };

    const updateStudent = async () => {
        if (!currentStudent) return;

        const isEmpty = Object.values(formData).some(value => !value.trim());
        if (isEmpty) {
            toast.error('❌ Please fill in all fields before updating');
            return;
        }

        try {
            const jsonData = JSON.stringify(formData);
            const level1EncryptedPayload = encryptLevel1(jsonData);
            await API.put(`/${currentStudent.id}`, { payload: level1EncryptedPayload });
            fetchStudents();
            closeModal();
            toast.success('✅ Student updated successfully');
        } catch {
            toast.error('❌ Error updating student');
        }
    };

    const deleteStudent = async () => {
        if (!currentStudent) return;

        try {
            await API.delete(`/${currentStudent.id}`);
            fetchStudents();
            closeModal();
            toast.success('✅ Student deleted successfully');
        } catch {
            toast.error('❌ Error deleting student');
        }
    };


    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="flex items-center justify-between bg-indigo-600 p-4 text-white">
                <div className="font-bold text-lg">
                    Student Panel <span className="ml-2 text-sm opacity-80">🔐 2-Level Encryption</span>
                </div>
                <button className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm" onClick={onLogout}>
                    Logout
                </button>
            </nav>

            {/* Container */}
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">📋 Students</h2>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm" onClick={openAddModal}>
                        ➕ Add Student
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full table-auto text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left">Full Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Phone</th>
                                <th className="px-4 py-2 text-left">DOB</th>
                                <th className="px-4 py-2 text-left">Gender</th>
                                <th className="px-4 py-2 text-left">Course</th>
                                <th className="px-4 py-2 text-left">Address</th>
                                <th className="px-4 py-2 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} className="border-t">
                                    <td className="px-4 py-2">{student.fullName}</td>
                                    <td className="px-4 py-2">{student.email}</td>
                                    <td className="px-4 py-2">{student.phone}</td>
                                    <td className="px-4 py-2">{student.dob}</td>
                                    <td className="px-4 py-2">{student.gender}</td>
                                    <td className="px-4 py-2">{student.course}</td>
                                    <td className="px-4 py-2">{student.address}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2 text-xs" onClick={() => openEditModal(student)}>✏️ Edit</button>
                                        <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 mt-1 rounded text-xs" onClick={() => openDeleteModal(student)}>🗑️ Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modalType && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        {modalType === 'add' && (
                            <>
                                <h3 className="text-lg font-semibold mb-4">➕ Add New Student</h3>
                                <StudentFormFields formData={formData} handleChange={handleChange} />
                                <div className="flex justify-end gap-2 mt-4">
                                    <button className="bg-gray-300 px-3 py-1 rounded" onClick={closeModal}>Cancel</button>
                                    <button className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700" onClick={addStudent}>
                                        Save
                                    </button>
                                </div>
                            </>
                        )}
                        {modalType === 'edit' && (
                            <>
                                <h3 className="text-lg font-semibold mb-4">✏️ Edit Student</h3>
                                <StudentFormFields formData={formData} handleChange={handleChange} />
                                <div className="flex justify-end gap-2 mt-4">
                                    <button className="bg-gray-300 px-3 py-1 rounded" onClick={closeModal}>Cancel</button>
                                    <button className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700" onClick={updateStudent}>
                                        Update
                                    </button>
                                </div>
                            </>
                        )}
                        {modalType === 'delete' && currentStudent && (
                            <>
                                <h3 className="text-lg font-semibold mb-2">🗑️ Delete Confirmation</h3>
                                <p>Are you sure you want to delete <b>{currentStudent.fullName}</b>?</p>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button className="bg-gray-300 px-3 py-1 rounded" onClick={closeModal}>Cancel</button>
                                    <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onClick={deleteStudent}>
                                        Yes, Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
};

interface FormFieldsProps {
    formData: Omit<Student, 'id'>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const StudentFormFields: React.FC<FormFieldsProps> = ({ formData, handleChange }) => (
    <>
        <div className="flex gap-2 mb-2">
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex gap-2 mb-2">
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="date" name="dob" placeholder="DOB" value={formData.dob} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex gap-2 mb-2">
            <select name="gender" value={formData.gender} onChange={handleChange} className="flex-1 border rounded px-3 py-2 text-sm">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            <select name="course" value={formData.course} onChange={handleChange} className="flex-1 border rounded px-3 py-2 text-sm">
                <option value="">Select Course</option>
                <option value="Angular">Angular</option>
                <option value="Java">Java</option>
                <option value="React">React</option>
                <option value="Python">Python</option>
                <option value="NodeJS">NodeJS</option>
            </select>
        </div>
        <div className="flex flex-col gap-2">
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
    </>
);
