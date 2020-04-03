import React, { useState, useEffect } from 'react'
import { ApolloProvider as ReactApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema } from 'graphql-tools'
import { Container, Screen } from '@kancha/kancha-ui'
import {} from 'react-navigation'
import * as Daf from 'daf-core'
import {
  core,
  dataStore,
  initializeDB,
  resolvers,
  typeDefs,
} from '../lib/setup'
import Debug from 'debug'

const debug = Debug('daf-provider:graphql')

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const contextLink = new SchemaLink({
  schema,
  context: { core, dataStore },
})

const link = from([contextLink])

export const cache = new InMemoryCache({})

export const client = new ApolloClient({
  connectToDevTools: true,
  cache,
  link,
})

core.on(Daf.EventTypes.validatedMessage, async (message: Daf.Message) => {
  debug('New message %O', message)
  await dataStore.saveMessage(message)

  client.reFetchObservableQueries()
})

interface Props {}

export const ApolloProvider: React.FC<Props> = ({ children }) => {
  const [isRunningMigrations, setIsRuning] = useState(true)

  const syncDaf = async () => {
    await initializeDB()
    await core.setupServices()
    await core.listen()

    setIsRuning(false)

    await core.getMessagesSince(await dataStore.latestMessageTimestamps())
  }

  useEffect(() => {
    syncDaf()
  }, [])

  return isRunningMigrations ? (
    <Screen safeArea background={'secondary'}>
      <Container h={45} dividerBottom background={'primary'} />
      <Container flex={1}>
        <Container>
          {[1, 2, 3, 4].map((fakeItem: number) => (
            <Container
              background={'primary'}
              padding
              marginBottom={5}
              key={fakeItem}
            >
              <Container
                background={'secondary'}
                viewStyle={{ borderRadius: 20, width: 40, height: 40 }}
              ></Container>
              <Container
                background={'secondary'}
                h={90}
                br={10}
                marginTop={20}
              ></Container>
            </Container>
          ))}
        </Container>
      </Container>
      <Container h={50} dividerTop background={'primary'} />
    </Screen>
  ) : (
    <ReactApolloProvider client={client}>
      <ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>
    </ReactApolloProvider>
  )
}
