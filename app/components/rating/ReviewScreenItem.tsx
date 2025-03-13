import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Flex} from '../layout/Flex';
import FastImage from 'react-native-fast-image';
import {Text} from '../core/Text/Text';
import CountryFlag from 'react-native-country-flag';
import StaticStar from './StaticStar';
import {useAppTheme} from 'app/hooks/theme/useAppTheme';
import {Review, UserInfo} from 'app/redux/user/userReducer';
import {getUser} from 'app/actions/chatAction';
import moment from 'moment';

type Props = {
  review: Review;
};

const ReviewScreenItem: React.FC<Props> = ({...props}): JSX.Element => {
  const {content, rate, date, user} = props.review;
  const theme = useAppTheme();
  const [student, setStudent] = useState<UserInfo>();
  const _date = moment(date).calendar();

  useEffect(() => {
    (async () => {
      const _ = await getUser(user);
      setStudent(_);
    })();
  }, [user]);

  if (!student) {
    return <></>;
  }

  return (
    <Flex
      padding={'spacing16'}
      borderBottomWidth={1}
      borderBottomColor={'background3'}
      marginRight={'spacing16'}
      mt={'spacing8'}
      gap={'spacing8'}
      borderRadius={'rounded4'}
      borderColor={'background3'}>
      <Flex flexDirection={'row'}>
        <FastImage style={styles.image} source={{uri: student.avatar}} />
        <Flex gap={'spacing2'}>
          <Text color={'textPrimary'} variant={'buttonLabelMedium'}>
            {student.firstName}{' '}
            <CountryFlag size={14} isoCode={student.country} />{' '}
          </Text>
          <Text color={'textPrimary'} variant={'buttonLabelMicro'}>
            {_date}
          </Text>
        </Flex>
      </Flex>
      <StaticStar color={theme.colors.textPrimary} number={rate} />
      <Text variant={'bodySmall'} color={'textPrimary'}>
        {content}
      </Text>
    </Flex>
  );
};

export default ReviewScreenItem;

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});
