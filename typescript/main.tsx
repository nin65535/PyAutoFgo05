// Bootstrap
import 'bootstrap'

// cssの読み込み
import './style.scss'

// FontAwesome
import '@fortawesome/fontawesome-pro/js/fontawesome'
import '@fortawesome/fontawesome-pro/js/all'


import * as React from 'react'
import { render } from 'react-dom'

import {App} from 'components/app'

render(<App/>,document.getElementById('app'))