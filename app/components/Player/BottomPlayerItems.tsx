import React from 'react';
import {Flex} from '../layout/Flex';

type Prop = {
  isReading: boolean;
  setIsReading: React.Dispatch<React.SetStateAction<boolean>>;
};

const BottomPlayerItems: React.FC<Prop> = ({isReading}): JSX.Element => {
  return (
    <>
      <Flex
        borderTopColor="accentActionSoft"
        borderTopWidth={isReading ? 2 : 0}
        flexDirection="row"
        height={60}
        mb="spacing10"
        style={{marginTop: 'auto'}}
      />
    </>
  );
};

export default BottomPlayerItems;
