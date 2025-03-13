import Image from 'app/components/core/Image/Image';
import {Flex} from 'app/components/layout/Flex';
import React from 'react';
import {TouchableNativeFeedback as Touchable} from 'react-native';

type StoryComponentProps = {
  thumbnail: string;
  onPress: () => void;
};

const StoryComponent: React.FC<StoryComponentProps> = ({
  thumbnail,
  onPress,
}) => {
  return (
    <Touchable onPress={onPress}>
      <Flex
        borderWidth={2}
        borderColor={'accentWarning'}
        width={55}
        height={55}
        padding={'spacing1'}
        marginRight={'spacing10'}
        borderRadius={'roundedFull'}>
        <Image
          style={{width: '100%', height: '100%', borderRadius: 100}}
          source={{uri: thumbnail}}
        />
      </Flex>
    </Touchable>
  );
};

export default StoryComponent;
