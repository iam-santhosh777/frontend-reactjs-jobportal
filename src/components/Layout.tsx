import { ReactNode, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Work,
  PostAdd,
  Assignment,
  Description,
  Logout,
  Menu,
  Close,
} from '@mui/icons-material';

interface LayoutProps {
  children: ReactNode;
}

const drawerWidth = 280;

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: user?.role === 'hr' ? '/hr/dashboard' : '/user/dashboard' },
      { text: 'Jobs', icon: <Work />, path: user?.role === 'hr' ? '/hr/jobs' : '/user/jobs' },
    ];

    if (user?.role === 'hr') {
      return [
        ...baseItems,
        { text: 'Post Job', icon: <PostAdd />, path: '/hr/post-job' },
        { text: 'Applications', icon: <Assignment />, path: '/hr/applications' },
        { text: 'Resume Uploads', icon: <Description />, path: '/hr/resumes' },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          HRMS + Job Portal
        </Typography>
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ color: 'white' }}
            aria-label="close drawer"
          >
            <Close />
          </IconButton>
        )}
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {user?.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.role.toUpperCase()}
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5, px: 2 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Logout */}
      <List sx={{ pb: 2 }}>
        <ListItem disablePadding sx={{ px: 2 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.light',
                color: 'error.dark',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50', overflowX: 'hidden' }}>
      {/* App Bar for Mobile */}
      <AppBar
        position="fixed"
        sx={{
          display: { xs: 'block', md: 'none' },
          bgcolor: 'primary.main',
          boxShadow: 2,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            HRMS + Job Portal
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Desktop Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'grey.50',
          overflowX: 'hidden',
          maxWidth: { md: `calc(100vw - ${drawerWidth}px)` },
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>{children}</Box>
        </motion.div>
      </Box>
    </Box>
  );
};
