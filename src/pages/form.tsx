import { useState } from "react";
import axios from "axios";

interface AddFormProps {
  onClose: () => void;
}

const AddForm: React.FC<AddFormProps> = ({ onClose }) => {
  const [name, setName] = useState<string>("");
  const [grade, setGrade] = useState<string>("A"); // Set default value to 'A'
  const [error, setError] = useState<string>("");

  // Mapping grades to points
  const gradePointsMap: { [key: string]: number } = {
    "A": 4.0,
    "B+": 3.5,
    "B": 3.0,
    "C+": 2.5,
    "C": 2.0,
    "D+": 1.5,
    "D": 1.0,
    "F": 0.0
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const points = gradePointsMap[grade]; // Get points for the selected grade
      const newStudent = { name, grade, points };
      
      // Replace with your actual backend URL
      await axios.post("http://localhost:5000/students", newStudent);
      
      // Optionally, you can refresh the list of students or notify the user
      onClose(); // Close the form after submission
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Set error message to state
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Add Student</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <input 
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full shadow-sm h-12 border border-gray-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="grade" className="block text-gray-700">Grade</label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-1 block w-full border border-gray-500  shadow-sm h-12"
              required
            >
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="D+">D+</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddForm;
