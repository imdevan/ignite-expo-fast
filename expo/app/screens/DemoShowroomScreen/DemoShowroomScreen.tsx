import { FC, ReactElement, useCallback, useEffect, useRef, useState } from "react"
import { SectionList, TextStyle, View, ViewStyle } from "react-native"
import { RouteProp, useRoute } from "@react-navigation/native"





import { Text } from "@/components/lib/Text"
import { DrawerWrapper } from "@/components/DrawerWrapper"
import { TxKeyPath } from "@/i18n"
import { translate } from "@/i18n/translate"
import { DemoTabParamList, DemoTabScreenProps } from "@/navigators/DemoNavigator"
import { useAppTheme } from "@/theme/context"

import type { Theme, ThemedStyle } from "@/theme/types"
import { hasValidStringProp } from "@/utils/hasValidStringProp"

import * as Demos from "./demos"

import SectionListWithKeyboardAwareScrollView from "./SectionListWithKeyboardAwareScrollView"
import { DevelopmentLinks } from "./DevelopmentLinks"



export interface Demo {
  name: string
  description: TxKeyPath
  data: ({ themed, theme }: { themed: any; theme: Theme }) => ReactElement[]
}






const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")



export const DemoShowroomScreen: FC<DemoTabScreenProps<"DemoShowroom">> =
  function DemoShowroomScreen(_props) {
    const timeout = useRef<ReturnType<typeof setTimeout>>(null)
    const listRef = useRef<SectionList>(null)
    const route = useRoute<RouteProp<DemoTabParamList, "DemoShowroom">>()
    const params = route.params

    const { themed, theme } = useAppTheme()


    const handleScroll = useCallback((sectionIndex: number, itemIndex = 0) => {
      try {
        listRef.current?.scrollToLocation({
          animated: true,
          itemIndex,
          sectionIndex,
          viewPosition: 0.25,
        })
      } catch (e) {
        console.error(e)
      }
    }, [])

    // handle Web links
    useEffect(() => {
      if (params !== undefined && Object.keys(params).length > 0) {
        const demoValues = Object.values(Demos)
        const findSectionIndex = demoValues.findIndex(
          (x) => x.name.toLowerCase() === params.queryIndex,
        )
        let findItemIndex = 0
        if (params.itemIndex) {
          try {
            findItemIndex = demoValues[findSectionIndex].data({ themed, theme }).findIndex((u) => {
              if (hasValidStringProp(u.props, "name")) {
                return (
                  slugify(translate((u.props as { name: TxKeyPath }).name)) === params.itemIndex
                )
              }
              return false
            })
          } catch (err) {
            console.error(err)
          }
        }
        handleScroll(findSectionIndex, findItemIndex)
      }
    }, [handleScroll, params, theme, themed])

    const scrollToIndexFailed = (info: {
      index: number
      highestMeasuredFrameIndex: number
      averageItemLength: number
    }) => {
      listRef.current?.getScrollResponder()?.scrollToEnd()
      timeout.current = setTimeout(
        () =>
          listRef.current?.scrollToLocation({
            animated: true,
            itemIndex: info.index,
            sectionIndex: 0,
          }),
        50,
      )
    }

    useEffect(() => {
      return () => {
        if (timeout.current) {
          clearTimeout(timeout.current)
        }
      }
    }, [])

    const drawerData = Object.values(Demos).map((d) => ({
      name: d.name,
      useCases: d.data({ theme, themed }).map((u) => {
        if (hasValidStringProp(u.props, "name")) {
          return translate((u.props as { name: TxKeyPath }).name)
        }
        return ""
      }),
    }))

    return (
      <DrawerWrapper
        drawerData={drawerData}
        onItemPress={handleScroll}
        drawerId="demoshowroom"
      >

          <SectionListWithKeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            ref={listRef}
            contentContainerStyle={themed($sectionListContentContainer)}
            stickySectionHeadersEnabled={false}
            sections={Object.values(Demos).map((d) => ({
              name: d.name,
              description: d.description,
              data: [d.data({ theme, themed })],
            }))}
            renderItem={({ item, index: sectionIndex }) => (
              <View>
                {item.map((demo: ReactElement, demoIndex: number) => (
                  <View key={`${sectionIndex}-${demoIndex}`}>{demo}</View>
                ))}
              </View>
            )}
            renderSectionFooter={() => <View style={themed($demoUseCasesSpacer)} />}
            ListHeaderComponent={
              <>
                <DevelopmentLinks />
                
                <View style={themed($heading)}>
                  <Text preset="heading" tx="demoShowroomScreen:jumpStart" />
                </View>
              </>
            }
            onScrollToIndexFailed={scrollToIndexFailed}
            renderSectionHeader={({ section }) => {
              return (
                <View>
                  <Text preset="heading" style={themed($demoItemName)}>
                    {section.name}
                  </Text>
                  <Text style={themed($demoItemDescription)}>{translate(section.description)}</Text>
                </View>
              )
            }}
          />
      </DrawerWrapper>
    )
  }

const $sectionListContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
})

const $heading: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxxl,
})

const $demoItemName: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 24,
  marginBottom: spacing.md,
})

const $demoItemDescription: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxl,
})

const $demoUseCasesSpacer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xxl,
})
