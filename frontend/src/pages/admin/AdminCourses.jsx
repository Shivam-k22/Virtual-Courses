import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App';
import { Search, Trash2, Eye, ChevronLeft, ChevronRight, Loader2, BookOpen, DollarSign, Users } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/api/admin/courses`, {
        params: { search, isPublished: statusFilter, page: currentPage, limit: 10 },
        withCredentials: true
      });
      setCourses(response.data.courses);
      setTotalPages(response.data.pages);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, statusFilter, currentPage]);

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    try {
      await axios.delete(`${serverUrl}/api/admin/courses/${selectedCourse._id}`, {
        withCredentials: true
      });
      toast.success('Course deleted successfully');
      setShowDeleteModal(false);
      setSelectedCourse(null);
      fetchCourses();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
        <p className="text-gray-500 mt-1">View and manage all courses on the platform</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
            {/* Thumbnail */}
            <div className="relative h-40 bg-gray-100">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <BookOpen className="w-12 h-12 text-gray-300" />
                </div>
              )}
              <span className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full ${
                course.isPublished 
                  ? 'bg-green-500 text-white' 
                  : 'bg-yellow-500 text-white'
              }`}>
                {course.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.subTitle || 'No description'}</p>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className={course.price ? 'font-semibold text-gray-900' : 'text-green-600 font-semibold'}>
                      {course.price ? `₹${course.price}` : 'Free'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolledStudents?.length || 0}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowDeleteModal(true);
                  }}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-xs text-gray-400 mt-2">
                By {course.creator?.name || 'Unknown'} • {new Date(course.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No courses found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Course</h2>
            <p className="text-gray-500 mb-4">
              Are you sure you want to delete "{selectedCourse.title}"? This action cannot be undone and will delete all associated lectures and enrollments.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCourse(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;