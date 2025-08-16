import React from "react"
import { Text } from "@/components/lib/Text"
import { Button } from "@/components/lib/Button"
import { Icon } from "@/components/lib/Icon"
import { useAuth } from "@/context/AuthContext"
import { useAppTheme } from "@/theme/context"
import { useDrawer } from "@/context/DrawerContext"
import { useNavigation, CommonActions, NavigationProp } from "@react-navigation/native"
import { AppStackParamList } from "@/navigators/AppNavigator"
import { DemoTabParamList } from "@/navigators/TabNavigator"
import { translate } from "@/i18n/translate"
import type { ThemedStyle } from "@/theme/types"
import type { ViewStyle, TextStyle } from "react-native"
import { Pressable, View } from "react-native"

/**
 * AppDrawer component that shows user information and logout button
 * 
 * Navigation Structure:
 * - AppNavigator (Stack) → contains "Drawer" screen
 * - DrawerNavigator (Stack) → contains "Tab" 
 * - TabNavigator (Bottom Tabs) → contains "DemoShowroom", "DemoItems", "DemoCommunity", "DemoDebug"
 * 
 * To navigate to specific tabs from the drawer, we use CommonActions.navigate
 * to navigate through the nested navigator structure.
 */
export function AppDrawer() {
  const { authEmail, logout } = useAuth()
  const { themed } = useAppTheme()
  const { closeDrawer } = useDrawer()
  const navigation = useNavigation<NavigationProp<AppStackParamList>>()
  
  // Navigation items for demo tabs
  const navigationItems = [
    { 
      label: translate("tabNavigator:componentsTab"), 
      screen: 'DemoShowroom' as const,
      icon: "components" as const
    },
    { 
      label: translate("tabNavigator:itemsTab"), 
      screen: 'DemoItems' as const,
      icon: "podcast" as const
    },
    { 
      label: translate("tabNavigator:communityTab"), 
      screen: 'DemoCommunity' as const,
      icon: "community" as const
    },
    { 
      label: translate("tabNavigator:debugTab"), 
      screen: 'DemoDebug' as const,
      icon: "debug" as const
    },
  ]

  const handleNavigation = (screen: keyof DemoTabParamList) => {
    closeDrawer()
    try {
      // Use CommonActions to navigate to nested screens
      navigation.dispatch(
        CommonActions.navigate({
          name: 'App',
          params: {
            screen: 'Tab',
            params: {
              screen,
            },
          },
        })
      )
    } catch (error) {
      console.error("Navigation error:", error)
    }
  }

  const handleUserProfileNavigation = () => {
    closeDrawer()
    try {
      // Navigate to UserProfile screen in DrawerNavigator
      navigation.dispatch(
        CommonActions.navigate({
          name: 'Drawer',
          params: {
            screen: 'UserProfile',
          },
        })
      )
    } catch (error) {
      console.error("Navigation error:", error)
    }
  }
  
  return (
    <View style={themed($drawerContainer)}>
      <View style={themed($userSection)}>
        <Pressable
          onPress={() => handleUserProfileNavigation()}
          style={themed($userNamePressable)}
        >
          <View style={themed($userNameContainer)}>
            <Text
              text={authEmail || "Guest User"}
              style={themed($userName)}
            />
            <Icon icon="settings" size={16} />
          </View>
        </Pressable>
        <Text
          text="Welcome to the demo app!"
          style={themed($welcomeText)}
        />
      </View>
      
      <View style={themed($navigationSection)}>
        <Text
          text="Navigation"
          style={themed($sectionTitle)}
        />
        {navigationItems.map((item, index) => (
          <Pressable
            key={item.screen}
            onPress={() => handleNavigation(item.screen)}
            style={themed($navItemPressable)}
          >
            <View style={themed($navItemContainer)}>
              <Icon icon={item.icon} size={20} />
              <Text
                text={item.label}
                style={themed($navItem)}
              />
            </View>
          </Pressable>
        ))}
      </View>
      
      <Button
        text="Logout"
        onPress={logout}
        style={themed($logoutButton)}
        textStyle={themed($logoutButtonText)}
      />
    </View>
  )
}

const $drawerContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.background,
  padding: spacing.lg,
  paddingTop: spacing.xl * 2,
})

const $userSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
})

const $userName: ThemedStyle<TextStyle> = ({ colors, spacing, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.bold,
  color: colors.text,
  marginTop: spacing.sm,
})

const $userNamePressable: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({

})

const $userNameContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
})

const $welcomeText: ThemedStyle<TextStyle> = ({ colors, spacing, typography }) => ({
  fontSize: 14,
  fontFamily: typography.primary.normal,
  color: colors.textDim,
  marginTop: spacing.xs,
})

const $navigationSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ colors, spacing, typography }) => ({
  fontSize: 16,
  fontFamily: typography.primary.bold,
  color: colors.text,
  marginBottom: spacing.md,
})

const $navItem: ThemedStyle<TextStyle> = ({ colors, spacing, typography }) => ({
  fontSize: 14,
  fontFamily: typography.primary.normal,
  color: colors.text,
  marginLeft: spacing.sm,
  flex: 1,
})

const $navItemPressable: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.sm,
  borderRadius: spacing.xs,
  padding: spacing.sm,
})

const $navItemContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
})

const $logoutButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.error,
  marginTop: spacing.lg,
})

const $logoutButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
}) 
