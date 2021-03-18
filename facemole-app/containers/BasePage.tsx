
import React from 'react';
import { Router, Scene, Drawer, Stack } from 'react-native-router-flux';

//import styles from '../styles/Main.style.tsx';

import SidebarMenu from './SidebarMenu';
import NavigationBar from './NavigationBar';

import FrontPage from './FrontPage';
import AccountPage from './AccountPage';
import PersonsPage from './PersonsPage';
import SinglePersonPage from './SinglePersonPage';
import LivePage from './LivePage';
import AddPersonPage from './AddPersonPage';

export default class BasePage extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {

        return (
            <Router>
                <Drawer
                    key="drawerMenu"
                    contentComponent={SidebarMenu}
                    navBar={NavigationBar}
                >
                    <Stack>
                        <Scene key="frontPage" component={FrontPage} title="Startseite" />
                        <Scene key="accountPage" component={AccountPage} title="Konto verwalten" />
                        <Scene key="personsPage" component={PersonsPage} title="Personen verwalten" />
                        <Scene key="singlePersonPage" component={SinglePersonPage} title="Person verwalten" />
                        <Scene key="livePage" component={LivePage} title="Live" />
                        <Scene key="addPersonPage" component={AddPersonPage} title="Person hinzufügen" />
                    </Stack>
                </Drawer>
            </Router>
        );
    }
}

