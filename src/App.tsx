import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Auth } from './components/Auth/Auth'
import { Home } from './components/Home/Home'
import 'antd/dist/antd.css'

import { DefaultLayout } from './layout/DefaultLayout'
import { Statistics } from './components/Home/Statistics'
import { Methods } from './components/Home/Methods'
import { getPeerList, pushNewMessage, savePeer, TG_getSelfUser } from './store/actions/userAction'
import { mtproto } from './api/telegramApi'
import { State } from './store'
import { IMessage, IPeer, TG_IMessage, TG_IPeer } from './types'

const App = () => {
  const dispatch = useDispatch()
  const peers = useSelector((state: State) => state.user.peers)
  const [definedPeer, setDefinedPeer] = useState<IPeer | null>(null)
  const userData = useSelector((state: State) => state.user.userData)
  const [receivedMessage, setReceivedMessage] = useState<TG_IMessage | null>(null)

  // TODO - Need to clean up this mess and sort into components and etc...

  useEffect(() => {
    dispatch(getPeerList())
    dispatch(TG_getSelfUser)
  }, [dispatch])

  const definePeer = useCallback(async () => {
    const TG_definedPeer = (await mtproto.call('users.getFullUser', {
      id: {
        _: 'inputUser',
        user_id: receivedMessage?.user_id,
        access_hash: userData?.access_hash,
      },
    })) as TG_IPeer

    const userObj: IPeer = {
      user_id: TG_definedPeer.user.id,
      username: TG_definedPeer.user.username,
      first_name: TG_definedPeer.user.first_name,
      last_name: TG_definedPeer.user.last_name,
      access_hash: TG_definedPeer.user.access_hash,
    }

    setDefinedPeer(userObj)

    dispatch(savePeer(userObj))
  }, [receivedMessage])

  useEffect(() => {
    if (receivedMessage) {
      const API_definedPeer = peers.find(
        peer => peer.user_id === receivedMessage.user_id.toString()
      )

      if (!API_definedPeer) {
        definePeer()
      } else {
        setDefinedPeer(API_definedPeer)
      }
    }
  }, [receivedMessage])

  useEffect(() => {
    mtproto.updates.on('updateShortMessage', (message: TG_IMessage) => {
      setReceivedMessage(message)
    })
  }, [])

  useEffect(() => {
    if (definedPeer && receivedMessage) {
      dispatch(
        pushNewMessage({
          sender: definedPeer,
          text: receivedMessage.message,
        })
      )
    }
  }, [definedPeer, receivedMessage])

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path={['/', '/statistics', '/methods']}>
            <DefaultLayout>
              <Fragment>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/statistics">
                  <Statistics />
                </Route>
                <Route exact path="/methods">
                  <Methods />
                </Route>
              </Fragment>
            </DefaultLayout>
          </Route>
          <Route exact path="/auth" component={Auth} />
          <Route
            path="*"
            component={() => {
              return <div>404</div>
            }}
          />
        </Switch>
      </Router>
    </div>
  )
}

export default App
