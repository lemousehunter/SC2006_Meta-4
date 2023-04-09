import * as React from "react";
import { View } from "react-native";
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import { SBItem } from "./SBItem";
import { Dimensions } from "react-native";

export const ElementsText = {
    AUTOPLAY: "AutoPlay",
};

export const window = Dimensions.get("window");

interface data {
    width: number,
    height: number,
    images: Array<string>,
}

function ParallaxCarousel(props:data) {
    const [isVertical, setIsVertical] = React.useState(false);
    const progressValue = useSharedValue<number>(0);
    const baseOptions =  ({
            vertical: false,
            width: props.width,
            height: props.height,
        } as const);
    console.log('ParallaxCarouselProps:' + JSON.stringify(props));
    return (
        <View
            style={{
                alignItems: "center",
            }}
        >
            <Carousel
                {...baseOptions}
                style={{
                    width: props.width,
                }}
                onProgressChange={(_, absoluteProgress) =>
                    (progressValue.value = absoluteProgress)
                }
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                }}
                data={props.images}
                renderItem={({ item, index }) => <SBItem index={index} source={item} />}
            />
            {!!progressValue && (
                <View
                    style={
                        isVertical
                            ? {
                                flexDirection: "column",
                                justifyContent: "space-between",
                                width: 10,
                                alignSelf: "center",
                                position: "absolute",
                                right: 5,
                                top: 40,
                            }
                            : {
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: 100,
                                alignSelf: "center",
                            }
                    }
                >
                    {props.images.map((backgroundColor, index) => {
                        return (
                            <PaginationItem
                                backgroundColor={backgroundColor}
                                animValue={progressValue}
                                index={index}
                                key={index}
                                isRotate={isVertical}
                                length={props.images.length}
                            />
                        );
                    })}
                </View>
            )}
        </View>
    );
}

const PaginationItem: React.FC<{
    index: number
    backgroundColor: string
    length: number
    animValue: Animated.SharedValue<number>
    isRotate?: boolean
}> = (props) => {
    const { animValue, index, length, backgroundColor, isRotate } = props;
    const width = 10;

    const animStyle = useAnimatedStyle(() => {
        let inputRange = [index - 1, index, index + 1];
        let outputRange = [-width, 0, width];

        if (index === 0 && animValue?.value > length - 1) {
            inputRange = [length - 1, length, length + 1];
            outputRange = [-width, 0, width];
        }

        return {
            transform: [
                {
                    translateX: interpolate(
                        animValue?.value,
                        inputRange,
                        outputRange,
                        Extrapolate.CLAMP,
                    ),
                },
            ],
        };
    }, [animValue, index, length]);
    return (
        <View
            style={{
                backgroundColor: "white",
                width,
                height: width,
                borderRadius: 50,
                overflow: "hidden",
                transform: [
                    {
                        rotateZ: isRotate ? "90deg" : "0deg",
                    },
                ],
            }}
        >
            <Animated.View
                style={[
                    {
                        borderRadius: 50,
                        backgroundColor,
                        flex: 1,
                    },
                    animStyle,
                ]}
            />
        </View>
    );
};

export default ParallaxCarousel;
