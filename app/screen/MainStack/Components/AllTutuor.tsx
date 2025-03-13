import {Flex} from 'app/components/layout/Flex';
import React from 'react';
import {UserInfo} from 'app/redux/user/userReducer';
import TutorItem from './TutorItem';
import {Text} from 'app/components/core/Text/Text';
import {useTranslation} from 'react-i18next';
import {CircularActivityIndicator} from 'app/components/ChatUI';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {ScrollView} from 'react-native';
import {FlashList} from '@shopify/flash-list';

type Props = {
  tutors: UserInfo[];
  loading: boolean;
  onRefresh: () => void;
};

const AllTutor = ({tutors, loading, onRefresh}: Props): React.JSX.Element => {
  //@ts-ignore
  const {t} = useTranslation();
  const theme = useAppTheme();

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <TutorItem key={index} user={item} />
  );

  return (
    <Flex
      backgroundColor={'background0'}
      flex={1}
      style={{marginLeft: -3.5}}
      paddingHorizontal={'spacing4'}>
      {tutors.length === 0 || loading ? (
        <ScrollView>
          {false ? (
            <Flex
              paddingVertical={'spacing16'}
              alignItems={'center'}
              px={'spacing10'}
              mt={'spacing90'}>
              <CircularActivityIndicator
                color={theme.colors.accentActive}
                size={50}
              />
            </Flex>
          ) : (
            <Flex
              paddingVertical={'spacing16'}
              backgroundColor={'accentSuccessSoft'}
              px={'spacing10'}
              mt={'spacing24'}>
              <Text variant={'buttonLabelSmall'} color={'textPrimary'}>
                {t('no_tutor_found')}
              </Text>
              <Text variant={'bodySmall'} color={'textSecondary'}>
                {t('no_tutor_found_desc')}
              </Text>
            </Flex>
          )}
        </ScrollView>
      ) : (
        <FlashList
          data={[...tutors]}
          onRefresh={onRefresh}
          refreshing={loading}
          contentContainerStyle={{paddingBottom: 10}}
          numColumns={1}
          renderItem={renderItem}
        />
      )}
    </Flex>
  );
};

export default AllTutor;
