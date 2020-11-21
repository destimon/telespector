import React, { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Auth } from './components/Auth/Auth'
import { Home } from './components/Home/Home'
import 'antd/dist/antd.css'

import { DefaultLayout } from './layout/DefaultLayout'
import { Statistics } from './components/Home/Statistics'
import { Methods } from './components/Home/Methods'
import { getPeerList, pushNewMessage, TG_getSelfUser } from './store/actions/userAction'
import { mtproto } from './api/telegramApi'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(TG_getSelfUser)
    dispatch(getPeerList())

    mtproto.updates.on('updateShortMessage', message => {
      console.log(message)

      dispatch(
        pushNewMessage({
          user_id: message.user_id,
          text: message.message,
        })
      )
    })
  }, [dispatch])

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
