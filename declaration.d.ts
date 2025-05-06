declare module '*.svg' {

    import React from 'react';
  
    import { SvgProps } from 'react-native-svg';
  
    const content: React.FC<SvgProps>;
  
    export default content;
  
  }

declare namespace NodeJS {

    interface ProcessEnv {
  
      EXPO_DEVELOPMENT_LOCA_BIRA_API_URL?: string;
  
    }
  
  }