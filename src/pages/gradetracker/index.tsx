import axios from "axios";
import { useEffect, useState } from "react";
import AddForm from "../form";
import StudentStatistics from "../statistics";
import { Pencil, Save, Trash, X } from "lucide-react";

// Define TypeScript interfaces
interface Student {
  id: string | number;
  name: string;
  grade: string;
  points: string; // Ensure points is a string for consistency
}

const grades = ["A", "B", "C", "D", "F"]; // Define the grades available for selection

// Define points for each grade
const gradePoints: Record<string, string> = {
  "A": "4.0",
  "B": "3.0",
  "C": "2.0",
  "D": "1.0",
  "F": "0.0",
};

const GradeTracker = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; grade: string; points: string } | null>(null);

  const handleEffect = async () => {
    try {
      const response = await axios.get("http://localhost:5000/students");
      console.log("API Response:", response.data); // Log the response to debug
      setStudents(response.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Set error message to state
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false); // Always set loading to false when done
    }
  };

  useEffect(() => {
    handleEffect();
  }, []);

  const handleAddStudent = () => {
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    handleEffect(); // Refresh the list after adding a new student
  };

  const handleDelete = async (id: string | number) => {
    try {
      await axios.delete(`http://localhost:5000/students/${id}`);
      handleEffect(); // Refresh the list after deletion
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Set error message to state
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleEditClick = (student: Student) => {
    setEditingId(student.id);
    setEditValues({ name: student.name, grade: student.grade, points: student.points });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditValues((prev) => {
      if (!prev) return null;

      // Update points if grade changes
      if (name === "grade") {
        return { ...prev, grade: value, points: gradePoints[value] };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSave = async (id: string | number) => {
    if (editValues) {
      try {
        await axios.put(`http://localhost:5000/students/${id}`, editValues);
        setEditingId(null);
        setEditValues(null);
        handleEffect(); // Refresh the list after editing
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Set error message to state
        } else {
          setError("An unknown error occurred");
        }
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="flex justify-center items-center font-serif font-bold pt-4 text-3xl mb-6 w-full">
          GradeTracker
        </h1>
        <button
          className="bg-purple-400 p-4 text-white rounded mb-4 whitespace-nowrap"
          onClick={handleAddStudent}
        >
          Add Student
        </button>
      </div>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {students.length === 0 && !loading && !error ? (
        <p className="text-center">No students data available</p>
      ) : (
        <div className="flex">
          {/* Table Section */}
          <div className="w-1/2 overflow-x-auto mb-6 mr-10">
            <table className="min-w-full bg-white border border-purple-400 rounded-lg shadow-md divide-y">
              <thead className="bg-purple-400 text-xl text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border border-purple-400">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border border-purple-400">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border border-purple-400">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border border-purple-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-purple-100"}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap border border-purple-400">
                      {editingId === student.id ? (
                        <input
                          type="text"
                          name="name"
                          value={editValues?.name || student.name}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        student.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border border-purple-400">
                      {editingId === student.id ? (
                        <select
                          name="grade"
                          value={editValues?.grade || student.grade}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {grades.map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      ) : (
                        student.grade
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border border-purple-400">
                      {editingId === student.id ? (
                        <span>{editValues?.points || student.points}</span>
                      ) : (
                        student.points
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border border-purple-400 flex space-x-2">
                      {editingId === student.id ? (
                        <>
                          <Save
                            onClick={() => handleSave(student.id)}
                            className="text-green-500 hover:text-green-700 cursor-pointer"
                            size={20}
                          />
                          <X
                            onClick={() => setEditingId(null)}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            size={20}
                          />
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(student)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Pencil size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash size={20} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statistics Section */}
          <div className="w-1/2">
            <StudentStatistics students={students} />
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && <AddForm onClose={handleCloseForm} />}
    </div>
  );
};

export default GradeTracker;
