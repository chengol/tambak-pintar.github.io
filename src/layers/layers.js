export const clusterLayer = {
    id: 'clusters',
    type: 'circle',
    source: 'earthquake',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': ['step', ['get', 'point_count'], '#ffb0c1', 5, '#ff94ab', 10, '#ff7795', 20, '#ff5b7e', 40, '#ff3e68'],
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
    }
  };
  
  export const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'earthquake',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  };
  
  export const unclusteredPointLayer = {
    id: 'unclustered-point',
    type: 'circle',
    source: 'earthquake',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#ffcdd8',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  };