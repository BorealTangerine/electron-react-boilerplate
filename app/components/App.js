/* @flow */

/* --------------------imports-------------------- */
import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import LoginScreen from './LoginScreen';
import Banner from './Banner';
import Footer from './Footer';
import ExceptionsContainer from './Exception';
import LoadersContainer from './Loader/LoadersContainer';

// import './App.css';
/*-----------------------------------------------*/
type Props = {};
export default class App extends React.Component<Props> {
  showExceptions = () => {
    const x = [].length;
    console.log(this);
    if (x === 0) {
      return 'hidden';
    }
    if (x > 0) {
      return 'visible';
    }
  };

  render() {
    const exceptionsVisible = this.showExceptions();
    return (
      <div>
        <LoginScreen />

        <header>
          <Banner />
        </header>
        <main className="myApp-content">
          <Grid columns={2} padded>
            <Grid.Column>
              <LoadersContainer />
            </Grid.Column>
            <Grid.Column textAlign="center">
              {/* <Container>
                            <div style={{visibility:true}}>
                                <ExceptionsContainer />
                            </div>
                        </Container> */}
            </Grid.Column>
          </Grid>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }
}
// const mapStateToProps = state => state;
//
// const AppConnect = connect(mapStateToProps)(App);
//
// export default AppConnect;
