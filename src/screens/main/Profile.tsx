import React from 'react'
import {
  Container,
  Text,
  Screen,
  Avatar,
  Constants,
  Button,
  BottomSnap,
  Credential,
  Icon,
} from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { SharedElement } from 'react-navigation-shared-element'
import { useQuery } from '@apollo/react-hooks'
import { GET_IDENTITY } from '../../lib/graphql/queries'
import { ActivityIndicator } from 'react-native'
import { Colors } from '../../theme'
import hexToRgba from 'hex-to-rgba'

interface Props extends NavigationStackScreenProps {}

const Profile: React.FC<Props> = ({ navigation }) => {
  const did = navigation.getParam('did')
  const isViewer = navigation.getParam('isViewer')
  const { data, loading } = useQuery(GET_IDENTITY, { variables: { did } })
  const identity = data && data.identity
  const source =
    identity && data.identity.profileImage
      ? { source: { uri: identity.profileImage } }
      : {}

  return (
    <Screen scrollEnabled background={'primary'}>
      {loading && (
        <Container padding flex={1}>
          <Container
            w={100}
            h={100}
            br={5}
            background={'secondary'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <ActivityIndicator size={'large'} />
          </Container>
          <Container marginTop>
            <Container h={23} br={5} background={'secondary'}></Container>
            <Container marginTop>
              <Container
                h={60}
                backgroundColor={hexToRgba(Colors.CONFIRM, 0.3)}
                padding
                br={5}
              ></Container>
            </Container>
          </Container>
        </Container>
      )}

      {!loading && (
        <Container padding flex={1}>
          <Avatar
            {...source}
            type={'rounded'}
            size={100}
            address={identity && identity.did}
            gravatarType={'retro'}
            backgroundColor={'white'}
          />
          <Container marginTop>
            <Text type={Constants.TextTypes.H2} bold>
              {identity && identity.shortId}
            </Text>
            <Container marginTop>
              <Container
                backgroundColor={hexToRgba(Colors.CONFIRM, 0.3)}
                padding
                br={5}
              >
                <Text textStyle={{ fontFamily: 'menlo' }} selectable>
                  {identity && identity.did}
                </Text>
              </Container>
            </Container>
          </Container>
        </Container>
      )}
      <Container padding>
        <Container>
          {isViewer ? (
            <Text type={Constants.TextTypes.Body}>
              This is your own profile.
            </Text>
          ) : (
            <Text type={Constants.TextTypes.Body}>
              This is an identity profile where you will be able to see all the
              interactions between you and them. Data share flows will also
              start here.
            </Text>
          )}
        </Container>
      </Container>
    </Screen>
  )
}

export default Profile
