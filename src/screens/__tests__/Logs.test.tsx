import 'react-native'
import React from 'react'
import { render } from 'react-native-testing-library'
import { MockedProvider } from 'react-apollo/test-utils'
import Logs from '../Logs'
import { LogMessage, LogMessageType, getLogsQuery } from '../../lib/Log'

jest.useFakeTimers()

const mockLogItem: LogMessage = {
  message: 'Sample info',
  type: LogMessageType.Info,
  category: 'Example',
  timestamp: 1234567890,
  id: '1234567',
}

const mocks = [
  {
    request: {
      query: getLogsQuery,
      variables: {},
    },
    result: {
      data: {
        logs: [mockLogItem],
      },
    },
  },
]

it('renders correctly', () => {
  const tree = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Logs />
    </MockedProvider>,
  ).toJSON()
  expect(tree).toMatchSnapshot()
})