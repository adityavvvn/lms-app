import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Welcome to LMS Platform
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Your gateway to quality education and professional development
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 4,
            }}
          >
            {!user ? (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  color="inherit"
                  size="large"
                >
                  Register
                </Button>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/dashboard"
                variant="contained"
                color="secondary"
                size="large"
              >
                Go to Dashboard
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose Our Platform?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/800x600?education"
                alt="Quality Education"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  Quality Education
                </Typography>
                <Typography>
                  Access high-quality courses taught by experienced instructors
                  and industry experts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/800x600?learning"
                alt="Flexible Learning"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  Flexible Learning
                </Typography>
                <Typography>
                  Learn at your own pace, anytime and anywhere. Access course
                  materials 24/7.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/800x600?certificate"
                alt="Certification"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  Certification
                </Typography>
                <Typography>
                  Earn certificates upon course completion to showcase your
                  skills and knowledge.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home; 