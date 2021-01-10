import * as React from 'react'

type Nav = {
    currentValue: number
    navValue: number
    label: string
    setValue: (val: number) => void
}

type Navs = {
    currentValue: number
    labels: string[]
    setValue: (val: number) => void
}
export function NavSelector(props: Navs): JSX.Element {
    const navs: JSX.Element[] = props.labels.map((label: string, i: number) => {
        return <NavItem key={i} navValue={i} label={label} {...props}></NavItem>
    })
    return (
        <nav className='my-2'>
            <ul className="nav nav-pills">
                {navs}
            </ul>
        </nav>
    )
}


function NavItem(props: Nav) {
    const active = (props.navValue === props.currentValue) ? ' active' : ''
    return (<li className="nav-item">
        <a className={'nav-link' + active}
            onClick={() => props.setValue(props.navValue)}
            href="#">
            {props.label}
        </a>
    </li>)
}