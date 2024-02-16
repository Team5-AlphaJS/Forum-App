import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { logoutUser } from "../../services/auth.service";
import { Avatar, Box, Button, IconButton, Image, Input, InputGroup, InputRightElement, Menu, MenuButton, MenuItem, MenuList, Text, useColorMode, useColorModeValue, useToast } from "@chakra-ui/react";
import blackLogo from '../../assets/black-helmet.svg';
import whiteLogo from '../../assets/white-helmet.svg';
import { FiEdit, FiMoon, FiSun, FiUser } from "react-icons/fi";

export default function Header() {
  const { user, userData, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();
  const isDarkMode = useColorModeValue(false, true);

  const logout = async () => {
    await logoutUser();
    setUser({ user: null, userData: null });
    toast({
      title: "Logged out successfully",
      status: "success",
      isClosable: true,
      position: "top",
      duration: 5000,
  });
    navigate('/');
  };

  const onSubmit = () => {
    if (search !== '') {
        setSearch(search);
        navigate(`/search`, { state: search });
        setSearch('');
    }
};

  return (
    <Box
      borderTop="5px solid"
      borderTopColor={"orange.400"}
      borderBottom="2px solid"
      shadow={"md"}
      height="70px"
      px="4"
      align="center"
      justifyContent="space-between"
      display="flex"
      alignItems={"center"}
      bg={isDarkMode ? "gray.900" : "gray.200"}
    >
      <Link to="/">
      <Image src={isDarkMode ? whiteLogo : blackLogo} alt="logo" />
      <Text fontFamily={'monospace'} fontSize={'15'}>Apex Assembly</Text>
      </Link>
      
      <NavLink to="/">Home</NavLink>
      <NavLink to="/drivers">Drivers</NavLink>
      { user && <NavLink to="/browse">Browse</NavLink> }
      { user && <NavLink to="/create-post">Create post</NavLink> }
      { user !== null && userData?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
      <InputGroup size="sm" maxW="300px">
        <Input
          type="text"
          placeholder="Search for posts..."
          borderColor="orange.200"
          maxW={"400px"}
          bg={isDarkMode ? "gray.700" : "gray.300"}
          _placeholder={{ color: isDarkMode ? "gray.400" : "black"}}
          _focus={{ borderColor: "orange.100" }}
          width="100%"
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputRightElement pointerEvents="none" color="gray.400" />
      </InputGroup>
      { user 
        ? (
          <>
            {`Welcome, ${userData?.username}`}
            <Menu>
              <MenuButton as={Box} display={'inline-block'} cursor={'pointer'}>
                <Avatar name={userData?.username} src={userData?.avatarUrl} size="md" mr={1} />
              </MenuButton>
              <MenuList>
                <MenuItem as={NavLink} to={`/user/edit`} icon={<FiEdit />}>Edit User</MenuItem>
                <MenuItem as={NavLink} to={`/user/${user?.uid}`} icon={<FiUser />}>User Details</MenuItem>
              </MenuList>
            </Menu>
            <Button onClick={logout} bg="orange.300" size={'sm'} w={20} textColor={'black'}>Logout</Button>
          </>
        )
        : (<>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </>) }
        <IconButton
          icon={isDarkMode ? <FiSun /> : <FiMoon />}
          size="md"
          ml={5}
          onClick={toggleColorMode}
          color={colorMode}
        />
  </Box>
  );
}
