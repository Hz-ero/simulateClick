import React from 'react'
import style from './index.css'
import SplitPanel from '../../lib/splitPanel.jsx'

const ShowPanel = (props) => (
  <div className={style.showPanel} >
    {props.children}
  </div>
)

const ShowBox = (props) => (
  <div className={style.showBox} >
    {props.children}
  </div>
)

const PanelBar = (props) => (
  <div className={style.panelBar} >
    {props.children}
  </div>
)

const App = () => (
  <div className={style.app} >
    <div className={style.column} >
      <ShowPanel>
        <PanelBar>垂直分割</PanelBar>

        <ShowBox>
          <SplitPanel />
        </ShowBox>
      </ShowPanel>

      <ShowPanel >
        <PanelBar>水平分割</PanelBar>

        <ShowBox>
          <SplitPanel ifHorizontal={true} />
        </ShowBox>
      </ShowPanel>
    </div>
    <div className={style.column} >
      <ShowPanel>
        <PanelBar>品字分割</PanelBar>

        <ShowBox>
          <SplitPanel>
            <ShowBox>
              <SplitPanel ifHorizontal={true} />
            </ShowBox>
          </SplitPanel>
        </ShowBox>
      </ShowPanel>

      <ShowPanel >
        <PanelBar>旧字分割</PanelBar>

        <ShowBox>
          <SplitPanel ifHorizontal={true} >
            <ShowBox>
              <SplitPanel />
            </ShowBox>
          </SplitPanel>
        </ShowBox>
      </ShowPanel>
    </div>
  </div>
)

export default App
