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
  Paper,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section 1 */}
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#f8f0fa', py: 0 }}>
        <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          {/* Greeting Badge */}
          <Paper elevation={2} sx={{ px: 3, py: 1, borderRadius: 99, mb: 3, fontWeight: 500, fontSize: 16 }}>
            Hey, Welcome
          </Paper>
          {/* Headline */}
          <Typography variant="h2" align="center" sx={{ fontWeight: 800, mb: 2, letterSpacing: -1 }}>
            Learn By Doing with <br /> ASTRON LMS
          </Typography>
          {/* Subheading/Quote */}
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
            "You don't understand anything until you learn it more than one way."
          </Typography>
          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 6 }}>
            <Button
              variant="contained"
              color="inherit"
              size="large"
              sx={{ fontWeight: 600, borderRadius: 3, bgcolor: '#111', color: '#fff', px: 4, '&:hover': { bgcolor: '#222' } }}
              component={RouterLink}
              to={user ? '/dashboard' : '/courses'}
            >
              Explore Now
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              sx={{ fontWeight: 600, borderRadius: 3, px: 4, borderColor: '#111', color: '#111', bgcolor: '#fff', '&:hover': { bgcolor: '#f5f5f5' } }}
              component={RouterLink}
              to="/register"
            >
              Become An Instructor
            </Button>
          </Box>
        </Container>
      </Box>
      {/* Hero Section 2 */}
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#eaf6fb', py: 0 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 6, flex: 1 }}>
          {/* Illustration Left */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', mb: { xs: 4, md: 0 } }}>
            <img
              src="https://cdn.pixabay.com/photo/2017/01/31/13/14/computer-2025792_1280.png"
              alt="Step by step lessons"
              style={{ maxWidth: 340, width: '100%', borderRadius: 24, boxShadow: '0 4px 24px #0001' }}
            />
          </Box>
          {/* Text Right */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ color: 'success.main', fontWeight: 700, mb: 1 }}>
              Step by step lessons
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: -1 }}>
              Put Your Learning Into Practise
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: 500 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus magnam quam recusandae ratione exercitationem laborum dicta nemo dolorem ducimus illo.
            </Typography>
          </Box>
        </Container>
      </Box>
      {/* Hero Section 3 */}
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#f8f0fa', py: 0 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row-reverse' }, alignItems: 'center', gap: 6, flex: 1 }}>
          {/* Illustration Right */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', mb: { xs: 4, md: 0 } }}>
            <img
              src="https://cdn.pixabay.com/photo/2017/01/31/13/14/computer-2025792_1280.png"
              alt="Learn By Doing"
              style={{ maxWidth: 340, width: '100%', borderRadius: 24, boxShadow: '0 4px 24px #0001' }}
            />
          </Box>
          {/* Text Left */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
              Fack Track Your Learning
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: -1 }}>
              Learn By Doing
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: 500 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus magnam quam recusandae ratione exercitationem laborum dicta nemo dolorem ducimus illo.
            </Typography>
          </Box>
        </Container>
      </Box>
      {/* Hero Section 4 (Support) */}
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#fff', py: 0 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 6, flex: 1 }}>
          {/* Text Left */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: -1, background: 'linear-gradient(90deg, #ffb6c1 0%, #fff 100%)', display: 'inline-block', pr: 1 }}>
              Let Us Knoe For Your Support
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio dolorem nemo autem! Iure repellendus quo eaque, vero ratione pariatur commodi dolore, omnis fugit cupiditate harum id accusamus nulla consequatur qui magni. Quibusdam, voluptatibus dignissimos!
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" color="secondary" sx={{ fontWeight: 600, borderRadius: 3, px: 4 }}>
                Contact Us
              </Button>
              <Button variant="outlined" color="inherit" sx={{ fontWeight: 600, borderRadius: 3, px: 4, bgcolor: '#eee', color: '#222', borderColor: '#bbb', '&:hover': { bgcolor: '#f5f5f5' } }}>
                Call for Support
              </Button>
            </Box>
          </Box>
          {/* Illustration Right */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', mb: { xs: 4, md: 0 } }}>
            <img
              src="https://cdn.pixabay.com/photo/2017/01/31/13/14/computer-2025792_1280.png"
              alt="Support"
              style={{ maxWidth: 340, width: '100%', borderRadius: 24, boxShadow: '0 4px 24px #0001' }}
            />
          </Box>
        </Container>
      </Box>
      {/* Footer */}
      <Box sx={{ borderTop: '1px solid #eee', bgcolor: '#fff', py: 2, mt: 0 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src="/logo192.png" alt="ASTRON Learning" style={{ height: 32 }} />
            <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 700 }}>
              ASTRON Learning
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
              FINANCIAL ADVISORS Management System
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Built by @ Astron_LMS_2025
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Home; 