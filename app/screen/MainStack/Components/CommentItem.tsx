import React from 'react';
import {StyleSheet} from 'react-native';
import {Flex} from 'app/components/layout/Flex';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import {Text} from 'app/components/core/Text/Text';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';

interface CommentItemProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  ownerId: string;
  content: string;
  created_at: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  user,
  content,
  created_at,
}: CommentItemProps) => {
  const date = moment(created_at).format('dddd, MMM D');

  return (
    <Flex px={'spacing10'} py={'spacing6'} flexDirection="row">
      <FastImage
        source={{
          uri: user.avatar,
          priority: FastImage.priority.normal,
        }}
        style={styles.avatar}
      />
      <Flex gap={'none'}>
        <Flex
          maxWidth={SCREEN_WIDTH - 90}
          borderRadius={'rounded8'}
          backgroundColor={'background2'}
          gap={'none'}
          py={'spacing4'}
          px={'spacing12'}>
          <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
            {`${user.firstName} ${user.lastName}`}
          </Text>
          <Text variant={'bodyLarge'} color={'textPrimary'}>
            {content}
          </Text>
        </Flex>
        <Text variant={'buttonLabelMicro'} color={'textSecondary'}>
          {date}
        </Text>
      </Flex>
    </Flex>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  author: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    marginTop: 5,
  },
});

export default CommentItem;
