import * as React from "react";
import { Platform, StatusBar, TouchableOpacity } from "react-native";
import { SplashScreen } from "expo";
import * as Font from "expo-font";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ThemeProvider } from "emotion-theming";
import styled from "@emotion/native";

import { darkTheme } from "constants/themes";
import AgnosticComponent from "components/AgnosticComponent";

import BottomTabNavigator from "./navigation/BottomTabNavigator";
import useLinking from "./navigation/useLinking";
import SideMenu from "./navigation/SideMenu";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.background,
}));

const HeaderIcon = styled(AgnosticComponent)(({ theme }) => ({
  padding: 10,
  marginLeft: 5,
  color: theme.mix(0.75),
}));

function Main({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Base"
        component={BottomTabNavigator}
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}
            >
              <HeaderIcon as={MaterialIcons} name="menu" size={20} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity>
              <HeaderIcon as={Ionicons} name="ios-settings" size={20} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default function Root(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "noto-sans": require("./fonts/NotoSans-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <ThemeProvider theme={darkTheme}>
        <Container>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <NavigationContainer
            ref={containerRef}
            initialState={initialNavigationState}
          >
            <Drawer.Navigator
              drawerContent={(props) => <SideMenu {...props} />}
            >
              <Drawer.Screen name="Main" component={Main} />
            </Drawer.Navigator>
          </NavigationContainer>
        </Container>
      </ThemeProvider>
    );
  }
}
