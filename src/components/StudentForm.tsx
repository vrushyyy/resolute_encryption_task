import React, { useState, useEffect } from 'react';
import '../index.css';
import API from '../api/axios';
import { encryptLevel1, decryptLevel1 } from '../utils/crypto';

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
            console.log('📡 Fetching students from backend...');
            const res = await API.get('/students');

            console.log('📥 Received response from backend:', res.data.length, 'students');

            const studentsData = res.data.map((stu: any) => {
                if (stu.payload) {
                    try {
                        console.log('🔓 Frontend: Decrypting Level 1 for student', stu.id);
                        
                        // Frontend decrypts Level 1 
                        const decryptedJson = decryptLevel1(stu.payload);
                        const studentObj = JSON.parse(decryptedJson);
                        
                        console.log('✅ Successfully decrypted student:', studentObj.email);
                        
                        return { id: stu.id, ...studentObj };
                    } catch (err) {
                        console.error(`❌ Level 1 decryption failed for ID ${stu.id}:`, err);
                        return {
                            id: stu.id,
                            fullName: 'Decryption Error',
                            email: '-',
                            phone: '-',
                            dob: '',
                            gender: '-',
                            course: '-',
                            address: '-',
                            password: '-',
                        };
                    }
                } else {
                    console.warn('⚠️ No payload found for student:', stu.id);
                    return {
                        id: stu.id,
                        fullName: 'No Data',
                        email: '-',
                        phone: '-',
                        dob: '',
                        gender: '-',
                        course: '-',
                        address: '-',
                        password: '-',
                    };
                }
            });

            console.log('✅ Final processed students:', studentsData.length);
            setStudents(studentsData);
        } catch (err) {
            console.error('❌ Fetch error:', err);
        }
    };

    useEffect(() => { fetchStudents(); }, []);

    // Add student with Level 1 encryption
    const addStudent = async () => {
        try {
            console.log('🔐 Frontend: Applying Level 1 encryption to student data');
            
            // Frontend Level 1 encryption
            const jsonData = JSON.stringify(formData);
            const level1EncryptedPayload = encryptLevel1(jsonData);
            
            console.log('📤 Sending Level 1 encrypted data to backend');

            await API.post('/register', { payload: level1EncryptedPayload });
            
            console.log('✅ Student added successfully with 2-level encryption');
            fetchStudents();
            closeModal();
        } catch (err) {
            console.error('❌ Error adding student:', err);
            alert('Error adding student');
        }
    };

    // Update student 
    const updateStudent = async () => {
        if (!currentStudent) return;
        try {
            console.log('🔐 Frontend: Applying Level 1 encryption for update');
            
            const jsonData = JSON.stringify(formData);
            const level1EncryptedPayload = encryptLevel1(jsonData);

            await API.put(`/${currentStudent.id}`, { payload: level1EncryptedPayload });
            
            console.log('✅ Student updated successfully with 2-level encryption');
            fetchStudents();
            closeModal();
        } catch (err) {
            console.error('❌ Error updating student:', err);
            alert('Error updating student');
        }
    };

    // Delete student
    const deleteStudent = async () => {
        if (!currentStudent) return;
        try {
            await API.delete(`/${currentStudent.id}`);
            console.log('🗑️ Student deleted successfully');
            fetchStudents();
            closeModal();
        } catch (err) {
            console.error('❌ Error deleting student:', err);
            alert('Error deleting student');
        }
    };

    return (
        <div className="student-page">
            <nav className="student-navbar">
                <div className="navbar-brand">
                    Student Panel 
                    <small style={{marginLeft: '10px', fontSize: '12px', opacity: 0.8}}>
                        🔐 2-Level Encryption Active
                    </small>
                </div>
                <button className="btn-logout" onClick={onLogout}>Logout</button>
            </nav>

            <div className="student-container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>📋 Students (2-Level Encrypted)</h2>
                    <button className="btn-primary small-btn" onClick={openAddModal}>➕ Add Student</button>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>DOB</th>
                            <th>Gender</th>
                            <th>Course</th>
                            <th>Address</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id}>
                                <td>{student.fullName}</td>
                                <td>{student.email}</td>
                                <td>{student.phone}</td>
                                <td>{student.dob}</td>
                                <td>{student.gender}</td>
                                <td>{student.course}</td>
                                <td>{student.address}</td>
                                <td className="text-center">
                                    <button className="btn-edit small-btn me-2" onClick={() => openEditModal(student)}>✏️ Edit</button>
                                    <button className="btn-delete small-btn" onClick={() => openDeleteModal(student)}>🗑️ Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalType && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {modalType === 'add' && (
                            <>
                                <h3>➕ Add New Student</h3>
                                <StudentFormFields formData={formData} handleChange={handleChange} />
                                <div className="modal-actions">
                                    <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                                    <button className="btn-primary" onClick={addStudent}>Save with 2-Level Encryption</button>
                                </div>
                            </>
                        )}
                        {modalType === 'edit' && (
                            <>
                                <h3>✏️ Edit Student</h3>
                                <StudentFormFields formData={formData} handleChange={handleChange} />
                                <div className="modal-actions">
                                    <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                                    <button className="btn-primary" onClick={updateStudent}>Update with 2-Level Encryption</button>
                                </div>
                            </>
                        )}
                        {modalType === 'delete' && currentStudent && (
                            <>
                                <h3>🗑️ Delete Confirmation</h3>
                                <p>Are you sure you want to delete <b>{currentStudent.fullName}</b>?</p>
                                <div className="modal-actions">
                                    <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                                    <button className="btn-delete" onClick={deleteStudent}>Yes, Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

interface FormFieldsProps {
    formData: Omit<Student, 'id'>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const StudentFormFields: React.FC<FormFieldsProps> = ({ formData, handleChange }) => (
    <>
        <div className="form-row">
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="form-control" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-row">
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="form-control" />
            <input type="date" name="dob" placeholder="DOB" value={formData.dob} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-row">
            <select name="gender" value={formData.gender} onChange={handleChange} className="form-control">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>

            <select name="course" value={formData.course} onChange={handleChange} className="form-control">
                <option value="">Select Course</option>
                <option value="Angular">Angular</option>
                <option value="Java">Java</option>
                <option value="React">React</option>
                <option value="Python">Python</option>
                <option value="NodeJS">NodeJS</option>
            </select>
        </div>

        <div className="form-row">
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="form-control full-width" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="form-control full-width" />
        </div>
    </>
);