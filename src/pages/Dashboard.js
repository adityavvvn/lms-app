import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Mock data for demonstration
const enrolledCourses = [
  {
    id: 1,
    title: 'Introduction to React',
    progress: 75,
    instructor: 'John Doe',
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    progress: 30,
    instructor: 'Jane Smith',
  },
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, letterSpacing: 1.1 }}>
        Welcome to Your Learning Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
              Your Progress Overview
            </Typography>
            <Typography variant="body1">
              You are enrolled in {enrolledCourses.length} courses
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
            Enrolled Courses
          </Typography>
        </Grid>

        {enrolledCourses.map((course) => (
          <Grid item xs={12} md={6} key={course.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  {course.title}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Instructor: {course.instructor}
                </Typography>
                <Typography variant="body2">
                  Progress: {course.progress}%
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  sx={{ fontWeight: 500, borderRadius: 2 }}
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  Continue Learning
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Dashboard; 