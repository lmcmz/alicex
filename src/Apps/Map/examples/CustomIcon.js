import React from 'react';
import {Text} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import sheet from '../styles/sheet';
import exampleIcon from '../Assets/example.png';

import BaseExamplePropTypes from './common/BaseExamplePropTypes';
import Page from './common/Page';
import Bubble from './common/Bubble';

const styles = {
  icon: {
    iconImage: exampleIcon,
    iconAllowOverlap: true,
  },
};

class CustomIcon extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes,
  };

  constructor(props) {
    super(props);

    this.state = {
      featureCollection: MapboxGL.geoUtils.makeFeatureCollection(),
    };
  }

  onPress = async (e) => {
    const feature = MapboxGL.geoUtils.makeFeature(e.geometry);
    console.log('feature: ', feature)
    feature.id = `${Date.now()}`;

    this.setState({
      featureCollection: MapboxGL.geoUtils.addToFeatureCollection(
        this.state.featureCollection,
        feature,
      ),
    });
  };

  onSourceLayerPress = (e) => {
    const feature = e.nativeEvent.payload;
    console.log('You pressed a layer here is your feature', feature); // eslint-disable-line
  };

  render() {
    return (
      <Page {...this.props}>
        <MapboxGL.MapView
          ref={c => (this._map = c)}
          onPress={this.onPress}
          style={sheet.matchParent}
        >
          <MapboxGL.Camera
            zoomLevel={9}
            centerCoordinate={[-73.970895, 40.723279]}
          />

          <MapboxGL.ShapeSource
            id="symbolLocationSource"
            hitbox={{width: 20, height: 20}}
            onPress={this.onSourceLayerPress}
            shape={this.state.featureCollection}
          >
            <MapboxGL.SymbolLayer
              id="symbolLocationSymbols"
              minZoomLevel={1}
              style={styles.icon}
            />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>

        <Bubble>
          <Text>Tap to add an icon</Text>
        </Bubble>
      </Page>
    );
  }
}

export default CustomIcon;
