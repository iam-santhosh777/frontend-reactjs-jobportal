import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Drawer,
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
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import nextHireLogo from '../assets/nextHire.png';
import {
  Dashboard,
  Work,
  PostAdd,
  Assignment,
  Description,
  Logout,
  Menu as MenuIcon,
  Settings,
  Notifications,
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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileAnchorRef = useRef<HTMLButtonElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const day = days[date.getDay()];
    const dayNum = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Get ordinal suffix for day
    const getOrdinalSuffix = (num: number) => {
      const j = num % 10;
      const k = num % 100;
      if (j === 1 && k !== 11) return 'st';
      if (j === 2 && k !== 12) return 'nd';
      if (j === 3 && k !== 13) return 'rd';
      return 'th';
    };
    
    return `${day}, ${month} ${dayNum}${getOrdinalSuffix(dayNum)}, ${year}`;
  };


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
    setProfileMenuOpen(false);
  };

  const handleProfileMenuOpen = () => {
    setProfileMenuOpen(true);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', pointerEvents: 'auto', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          pt: { xs: 3, sm: 2.5, md: 3 },
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          minHeight: { xs: 'auto', sm: 'auto' },
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            flex: 1,
            minWidth: 0,
            width: { xs: 'calc(100% - 48px)', sm: 'auto' },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={formatDate(currentTime)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                  color: 'white',
                  lineHeight: 1.2,
                  mb: { xs: 0.25, sm: 0.5 },
                  textTransform: 'capitalize',
                  wordBreak: 'break-word',
                }}
              >
                {formatDate(currentTime)}
              </Typography>
            </motion.div>
          </AnimatePresence>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.25, sm: 0.5 },
              fontFamily: 'monospace',
              flexWrap: 'wrap',
            }}
          >
            {/* Hours */}
            <Box sx={{ position: 'relative', overflow: 'hidden', minWidth: '2ch' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTime.getHours()}
                  initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    filter: 'blur(0px)',
                    transition: {
                      opacity: { duration: 0.3 },
                      y: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
                      filter: { duration: 0.3 }
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -8, 
                    filter: 'blur(4px)',
                    transition: { duration: 0.2 }
                  }}
                  style={{ position: 'relative' }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                      color: 'white',
                      lineHeight: 1.2,
                      fontFamily: 'monospace',
                      letterSpacing: { xs: '0.02em', sm: '0.05em' },
                    }}
                  >
                    {String(currentTime.getHours() % 12 || 12).padStart(2, '0')}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>
            
            {/* Colon */}
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                color: 'white',
                lineHeight: 1.2,
                fontFamily: 'monospace',
              }}
            >
              :
            </Typography>
            
            {/* Minutes */}
            <Box sx={{ position: 'relative', overflow: 'hidden', minWidth: '2ch' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTime.getMinutes()}
                  initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    filter: 'blur(0px)',
                    transition: {
                      opacity: { duration: 0.3 },
                      y: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
                      filter: { duration: 0.3 }
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -8, 
                    filter: 'blur(4px)',
                    transition: { duration: 0.2 }
                  }}
                  style={{ position: 'relative' }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                      color: 'white',
                      lineHeight: 1.2,
                      fontFamily: 'monospace',
                      letterSpacing: { xs: '0.02em', sm: '0.05em' },
                    }}
                  >
                    {String(currentTime.getMinutes()).padStart(2, '0')}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>
            
            {/* Colon */}
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                color: 'white',
                lineHeight: 1.2,
                fontFamily: 'monospace',
              }}
            >
              :
            </Typography>
            
            {/* Seconds */}
            <Box sx={{ position: 'relative', overflow: 'hidden', minWidth: '2ch' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTime.getSeconds()}
                  initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    filter: 'blur(0px)',
                    transition: {
                      opacity: { duration: 0.3 },
                      y: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
                      filter: { duration: 0.3 }
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -8, 
                    filter: 'blur(4px)',
                    transition: { duration: 0.2 }
                  }}
                  style={{ position: 'relative' }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                      color: 'white',
                      lineHeight: 1.2,
                      fontFamily: 'monospace',
                      letterSpacing: { xs: '0.02em', sm: '0.05em' },
                    }}
                  >
                    {String(currentTime.getSeconds()).padStart(2, '0')}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>
            
            {/* AM/PM */}
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                color: 'white',
                lineHeight: 1.2,
                fontFamily: 'monospace',
                ml: { xs: 0.25, sm: 0.5 },
              }}
            >
              {currentTime.getHours() >= 12 ? 'PM' : 'AM'}
            </Typography>
          </Box>
        </Box>
        
      </Box>


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
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
            disableAutoFocus: true,
            disableEnforceFocus: true,
            disableRestoreFocus: true,
          }}
          PaperProps={{
            sx: {
              boxSizing: 'border-box',
              width: drawerWidth,
              opacity: 1,
              backgroundColor: 'background.paper',
              top: { xs: '56px', sm: '64px' },
              height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
            },
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Navigation Bar for All Devices */}
        <AppBar
          position="fixed"
          elevation={2}
          sx={{
            bgcolor: 'white',
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: 'divider',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            top: 0,
            left: { xs: 0, md: drawerWidth },
            right: 0,
            width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              px: { xs: 2, sm: 3, md: 3 },
              minHeight: { xs: 56, sm: 64, md: 64 },
            }}
          >
            {/* Left: Hamburger Menu (only on mobile/tablet) */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{
                color: 'text.primary',
                mr: 2,
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Left: App Logo */}
            <Box
              component="img"
              src={nextHireLogo}
              alt="nextHire"
              sx={{
                height: { xs: 28, sm: 32, md: 36 },
                width: 'auto',
                objectFit: 'contain',
                display: { xs: 'none', sm: 'block' },
                mr: { xs: 0, sm: 2 },
              }}
            />

            {/* Spacer to push action icons to the right */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Right: Action Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Settings Icon */}
              <IconButton
                color="inherit"
                aria-label="settings"
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Settings />
              </IconButton>

              {/* Notifications Icon */}
              <IconButton
                color="inherit"
                aria-label="notifications"
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Badge badgeContent={0} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              {/* Profile Avatar with Dropdown */}
              <IconButton
                ref={profileAnchorRef}
                onClick={handleProfileMenuOpen}
                sx={{
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                aria-label="profile menu"
              >
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    width: { xs: 32, sm: 36, md: 36 },
                    height: { xs: 32, sm: 36, md: 36 },
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1rem' },
                  }}
                >
                  {getUserInitials()}
                </Avatar>
              </IconButton>

              {/* Profile Dropdown Menu */}
              <Menu
                anchorEl={profileAnchorRef.current}
                open={profileMenuOpen}
                onClose={handleProfileMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    boxShadow: 3,
                    borderRadius: 2,
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user?.name || 'User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email || ''}
                  </Typography>
                </Box>
                <MenuItem
                  onClick={() => {
                    handleProfileMenuClose();
                    // Settings action can be added here
                  }}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: 'error.light',
                      color: 'error.dark',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content Area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            overflowX: 'hidden',
            mt: { xs: '56px', sm: '64px', md: '64px' },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Box
              sx={{
                p: { xs: 0.5, sm: 2, md: 3 },
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                flex: 1,
              }}
            >
              {children}
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};
