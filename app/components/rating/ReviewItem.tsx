import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Flex} from '../layout/Flex';
import FastImage from 'react-native-fast-image';
import {Text} from '../core/Text/Text';
import CountryFlag from 'react-native-country-flag';
import StaticStar from './StaticStar';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {TouchableNativeFeedback as Touchable} from 'react-native';
import ViewMoreText from 'react-native-view-more-text';
import {UserInfo} from 'app/redux/user/userReducer';
import {getUser} from 'app/actions/chatAction';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

type Props = {
  onpress?: () => void;
  user: string;
  rate: number;
  content: string;
  date: number;
  reply?: {
    date: number;
    content: string;
  };
};

const ReviewItem: React.FC<Props> = ({...props}): JSX.Element => {
  const {date, onpress, user, content, rate} = props;
  const theme = useAppTheme();
  //@ts-ignore
  const {t} = useTranslation();
  const [student, setStudent] = useState<UserInfo>();
  const _date = moment(date).calendar();

  useEffect(() => {
    (async () => {
      const _ = await getUser(user);
      setStudent(_);
    })();
  }, [user]);

  const renderViewMore = () => (
    <Text
      marginTop={'spacing16'}
      textDecorationLine={'underline'}
      variant={'buttonLabelMicro'}
      color={'textPrimary'}>
      {t('view_more')}
    </Text>
  );
  const renderViewLess = () => (
    <Text
      marginTop={'spacing16'}
      textDecorationLine={'underline'}
      variant={'buttonLabelMicro'}
      color={'textPrimary'}>
      {t('view_less')}
    </Text>
  );

  if (!student) {
    return <></>;
  }

  return (
    <Touchable onPress={onpress}>
      <Flex
        borderWidth={1}
        borderEndColor={'background3'}
        padding={'spacing16'}
        marginRight={'spacing16'}
        width={300}
        height={200}
        backgroundColor={'background1'}
        borderRadius={'rounded8'}
        borderColor={'background3'}>
        <Flex flexDirection={'row'}>
          <FastImage style={styles.image} source={{uri: student.avatar}} />
          <Flex gap={'spacing2'}>
            <Text color={'textPrimary'} variant={'buttonLabelMicro'}>
              {student.firstName}{' '}
              <CountryFlag size={14} isoCode={student.country} />{' '}
            </Text>
            <Text color={'textSecondary'} variant={'bodyMicro'}>
              {_date}
            </Text>
          </Flex>
        </Flex>
        <StaticStar color={theme.colors.textPrimary} number={rate} />
        <ViewMoreText
          numberOfLines={4}
          renderViewMore={renderViewMore}
          renderViewLess={renderViewLess}>
          <Text color={'textPrimary'} variant={'bodyMicro'}>
            {content}
          </Text>
        </ViewMoreText>
      </Flex>
    </Touchable>
  );
};

export default ReviewItem;

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});
