import { useState, useEffect } from 'react';
import { api } from '../index';

export function useAdminLearning(category?: string) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchCourses = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.admin.getLearning(page, limit);
      setCourses(data.courses || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (title: string, description: string, content: string) => {
    try {
      await api.admin.createTutorial(title, description, content);
      await fetchCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to create course');
    }
  };

  const deleteCourse = async (id: number) => {
    try {
      await api.admin.deleteTutorial(id);
      await fetchCourses();
    } catch (err: any) {
      setError(err.message || 'Failed to delete course');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [category]);

  return { 
    courses, 
    loading, 
    error, 
    total,
    createCourse, 
    deleteCourse,
    refetch: fetchCourses 
  };
}
