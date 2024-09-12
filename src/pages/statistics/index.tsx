import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register the chart.js components we are using
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StudentStatisticsProps {
  students: { id: string | number; name: string; grade: string; points: number | string }[];
}

const StudentStatistics: React.FC<StudentStatisticsProps> = ({ students }) => {
  const totalStudents = students.length;

  // Convert points to numbers
  const validGradepoints = students
    .map(student => (typeof student.points === 'string' ? parseFloat(student.points) : student.points))
    .filter(point => !isNaN(point));

  // Calculate the average, highest, and lowest gradepoints
  const totalGradepoints = validGradepoints.reduce((sum, point) => sum + point, 0);
  const averageGradepoints = totalStudents > 0 ? (totalGradepoints / totalStudents) : 0;
  const highestGradepoints = validGradepoints.length > 0 ? Math.max(...validGradepoints) : 0;
  const lowestGradepoints = validGradepoints.length > 0 ? Math.min(...validGradepoints) : 0;

  // Data for the chart
  const chartData = {
    labels: ["Average Grade Points", "Highest Grade Points", "Lowest Grade Points"],
    datasets: [
      {
        label: "Grade Points",
        data: [averageGradepoints, highestGradepoints, lowestGradepoints],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Student Statistics: Average, Highest, and Lowest Grade Points",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Grade Points",
        },
      },
    },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold mb-4">Student Statistics</h2>
  
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-gray-600"></div>
        <p className="font-semibold mr-2">Total Students:</p>
        <p>{totalStudents}</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-teal-500"></div>
        <p className="font-semibold mr-2">Average Grade Points:</p>
        <p>{averageGradepoints.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
        <p className="font-semibold mr-2">Highest Grade Points:</p>
        <p>{highestGradepoints}</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <p className="font-semibold mr-2">Lowest Grade Points:</p>
        <p>{lowestGradepoints}</p>
      </div>
    </div>
  
    {/* Display the bar chart */}
    <div className="mt-6">
      <Bar data={chartData} options={chartOptions} />
    </div>
  </div>
  

  );
};

export default StudentStatistics;
