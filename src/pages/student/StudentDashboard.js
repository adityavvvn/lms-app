import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authAxios from '../../utils/authAxios';

function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await authAxios.get('/api/user/courses');
      // The API returns { courses: [...], progress: [...] }
      const courses = response.data.courses || [];
      const progress = response.data.progress || [];
      
      // Combine course data with progress
      const coursesWithProgress = courses.map(course => {
        const courseProgress = progress.find(p => p.course._id === course._id);
        return {
          ...course,
          progress: courseProgress ? courseProgress.progress : 0
        };
      });
      
      setEnrolledCourses(coursesWithProgress);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setError(err.response?.data?.message || 'Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/courses')}
          sx={{ mt: 2 }}
        >
          Browse Courses
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Courses
      </Typography>

      {enrolledCourses.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography color="textSecondary" gutterBottom>
            You haven't enrolled in any courses yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/courses')}
            sx={{ mt: 2 }}
          >
            Browse Courses
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {enrolledCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                    cursor: 'pointer',
                  },
                }}
                onClick={() => navigate(`/courses/${course._id}/learn`)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={course.thumbnail || 'https://via.placeholder.com/300x140'}
                  alt={course.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {course.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {course.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress || 0}
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {Math.round(course.progress || 0)}% Complete
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default StudentDashboard; 