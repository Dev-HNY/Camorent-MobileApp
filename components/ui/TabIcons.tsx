import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { View } from 'react-native';

interface TabIconProps {
  focused: boolean;
}

export const HomeIcon: React.FC<TabIconProps> = ({ focused }) => {
  if (focused) {
    return (
      <View
        style={{
          width: 41,
          height: 41,
          borderRadius: 20.5,
          backgroundColor: '#6D00DA',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path
            d="M11.4697 3.84076C11.7626 3.54787 12.2374 3.54787 12.5303 3.84076L21.2197 12.5301C21.5126 12.823 21.9874 12.823 22.2803 12.5301C22.5732 12.2372 22.5732 11.7623 22.2803 11.4694L13.591 2.7801C12.7123 1.90142 11.2877 1.90142 10.409 2.7801L1.71967 11.4694C1.42678 11.7623 1.42678 12.2372 1.71967 12.5301C2.01256 12.823 2.48744 12.823 2.78033 12.5301L11.4697 3.84076Z"
            fill="white"
          />
          <Path
            d="M12 5.43176L20.159 13.5908C20.1887 13.6205 20.2191 13.6492 20.25 13.6769V19.8748C20.25 20.9103 19.4105 21.7498 18.375 21.7498H15C14.5858 21.7498 14.25 21.414 14.25 20.9998V16.4998C14.25 16.0856 13.9142 15.7498 13.5 15.7498H10.5C10.0858 15.7498 9.75 16.0856 9.75 16.4998V20.9998C9.75 21.414 9.41421 21.7498 9 21.7498H5.625C4.58947 21.7498 3.75 20.9103 3.75 19.8748V13.6769C3.78093 13.6492 3.81127 13.6205 3.84099 13.5908L12 5.43176Z"
            fill="white"
          />
        </Svg>
      </View>
    );
  }

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M11.4697 3.84076C11.7626 3.54787 12.2374 3.54787 12.5303 3.84076L21.2197 12.5301C21.5126 12.823 21.9874 12.823 22.2803 12.5301C22.5732 12.2372 22.5732 11.7623 22.2803 11.4694L13.591 2.7801C12.7123 1.90142 11.2877 1.90142 10.409 2.7801L1.71967 11.4694C1.42678 11.7623 1.42678 12.2372 1.71967 12.5301C2.01256 12.823 2.48744 12.823 2.78033 12.5301L11.4697 3.84076Z"
        fill="#8E0FFF"
      />
      <Path
        d="M12 5.43176L20.159 13.5908C20.1887 13.6205 20.2191 13.6492 20.25 13.6769V19.8748C20.25 20.9103 19.4105 21.7498 18.375 21.7498H15C14.5858 21.7498 14.25 21.414 14.25 20.9998V16.4998C14.25 16.0856 13.9142 15.7498 13.5 15.7498H10.5C10.0858 15.7498 9.75 16.0856 9.75 16.4998V20.9998C9.75 21.414 9.41421 21.7498 9 21.7498H5.625C4.58947 21.7498 3.75 20.9103 3.75 19.8748V13.6769C3.78093 13.6492 3.81127 13.6205 3.84099 13.5908L12 5.43176Z"
        fill="#8E0FFF"
      />
    </Svg>
  );
};

export const MyShootsIcon: React.FC<TabIconProps> = ({ focused }) => {
  if (focused) {
    return (
      <View
        style={{
          width: 41,
          height: 41,
          borderRadius: 20.5,
          backgroundColor: '#6D00DA',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Svg width="21" height="15" viewBox="0 0 21 15" fill="none">
          <Path
            d="M14.25 6L18.9697 1.28033C19.4421 0.807855 20.25 1.14248 20.25 1.81066V13.1893C20.25 13.8575 19.4421 14.1921 18.9697 13.7197L14.25 9M3 14.25H12C13.2426 14.25 14.25 13.2426 14.25 12V3C14.25 1.75736 13.2426 0.75 12 0.75H3C1.75736 0.75 0.75 1.75736 0.75 3V12C0.75 13.2426 1.75736 14.25 3 14.25Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    );
  }

  return (
    <Svg width="21" height="15" viewBox="0 0 21 15" fill="none">
      <Path
        d="M14.25 6L18.9697 1.28033C19.4421 0.807855 20.25 1.14248 20.25 1.81066V13.1893C20.25 13.8575 19.4421 14.1921 18.9697 13.7197L14.25 9M3 14.25H12C13.2426 14.25 14.25 13.2426 14.25 12V3C14.25 1.75736 13.2426 0.75 12 0.75H3C1.75736 0.75 0.75 1.75736 0.75 3V12C0.75 13.2426 1.75736 14.25 3 14.25Z"
        stroke="#8E0FFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const ProfileIcon: React.FC<TabIconProps> = ({ focused }) => {
  if (focused) {
    return (
      <View
        style={{
          width: 41,
          height: 41,
          borderRadius: 20.5,
          backgroundColor: '#6D00DA',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path
            d="M15.7498 6C15.7498 8.07107 14.0709 9.75 11.9998 9.75C9.92877 9.75 8.24984 8.07107 8.24984 6C8.24984 3.92893 9.92877 2.25 11.9998 2.25C14.0709 2.25 15.7498 3.92893 15.7498 6Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M4.50098 20.1182C4.57128 16.0369 7.90171 12.75 11.9998 12.75C16.0981 12.75 19.4286 16.0371 19.4987 20.1185C17.2159 21.166 14.6762 21.75 12.0002 21.75C9.32384 21.75 6.78394 21.1659 4.50098 20.1182Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    );
  }

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.7498 6C15.7498 8.07107 14.0709 9.75 11.9998 9.75C9.92877 9.75 8.24984 8.07107 8.24984 6C8.24984 3.92893 9.92877 2.25 11.9998 2.25C14.0709 2.25 15.7498 3.92893 15.7498 6Z"
        stroke="#8E0FFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.50098 20.1182C4.57128 16.0369 7.90171 12.75 11.9998 12.75C16.0981 12.75 19.4286 16.0371 19.4987 20.1185C17.2159 21.166 14.6762 21.75 12.0002 21.75C9.32384 21.75 6.78394 21.1659 4.50098 20.1182Z"
        stroke="#8E0FFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};