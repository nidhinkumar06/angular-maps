import { Component, OnInit, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-map-dashboard',
  templateUrl: './map-dashboard.component.html',
  styleUrls: ['./map-dashboard.component.scss']
})
export class MapDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  map: mapboxgl.Map;
  // style = 'mapbox://styles/mapbox/streets-v11';
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 11.007500;
  lng = 76.967100;

  lat1 = 13.0827;
  lng1 = 80.2707;


  constructor(private zone: NgZone) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  ngOnInit() {
    this.map = new mapboxgl.Map({
      container: 'map',
      // style: this.style,
      // zoom: 13,
      // center: [this.lng, this.lat]
      style: this.style,
      center: [-120, 50],
      zoom: 2
    });

    this.loadMap();
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.FullscreenControl());
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.getChart1();
      this.getChart2();
      this.getGaugeChart();
    });
  }

  ngOnDestroy() {}

  getChart1() {
    const chart = am4core.create('chartdiv', am4charts.PieChart);

    chart.data = [{
      'country': 'Lithuania',
      'litres': 501.9,
      'color': am4core.color('#ED1C24')
    }, {
      'country': 'Czechia',
      'litres': 301.9,
      'color': am4core.color('#235789')
    }, {
      'country': 'Ireland',
      'litres': 201.1,
      'color': am4core.color('#F1D302')
    }, {
      'country': 'Germany',
      'litres': 165.8,
      'color': am4core.color('#020100')
    }];

    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'litres';
    pieSeries.dataFields.category = 'country';

    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.labels.template.text = `{value.percent.formatNumber('#.0')}%`;
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color('white');
  }

  getChart2() {
    const chartTwo = am4core.create('chartTwo', am4charts.PieChart);

    chartTwo.data = [{
      'country': 'Ireland',
      'litres': 50,
      'color': am4core.color('#ED1C24')
    }, {
      'country': 'India',
      'litres': 5,
      'color': am4core.color('#F1D302')
    }];

    const pieSeries2 = chartTwo.series.push(new am4charts.PieSeries());
    pieSeries2.dataFields.value = 'litres';
    pieSeries2.dataFields.category = 'country';

    pieSeries2.ticks.template.disabled = true;
    pieSeries2.alignLabels = false;
    pieSeries2.labels.template.text = `{value.percent.formatNumber('#.0')}%`;
    pieSeries2.labels.template.radius = am4core.percent(-40);
    pieSeries2.labels.template.fill = am4core.color('white');
  }

  getGaugeChart() {
    const guageChart = am4core.create('chartguage', am4charts.GaugeChart);
    guageChart.innerRadius = am4core.percent(82);

    const axis = guageChart.xAxes.push(new am4charts.ValueAxis() as any);
    axis.min = 0;
    axis.max = 100;
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(80);
    axis.renderer.inside = true;
    axis.renderer.line.strokeOpacity = 1;
    axis.renderer.ticks.template.strokeOpacity = 1;
    axis.renderer.ticks.template.length = 10;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.radius = 40;
    axis.renderer.labels.template.fill = am4core.color('white');
    axis.renderer.labels.template.adapter.add('text', function(text) {
      return text;
    });

    const colorSet = new am4core.ColorSet();

    const axis2 = guageChart.xAxes.push(new am4charts.ValueAxis() as any);
    axis2.min = 0;
    axis2.max = 100;
    axis2.renderer.innerRadius = 10;
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;

    const range0 = axis2.axisRanges.create();
    range0.value = 0;
    range0.endValue = 50;
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = colorSet.getIndex(0);

    const range1 = axis2.axisRanges.create();
    range1.value = 50;
    range1.endValue = 100;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = colorSet.getIndex(2);

    const label = guageChart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 45;
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'bottom';
    label.text = '50%';
    label.fill = am4core.color('white');

    const hand = guageChart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(20);
    hand.startWidth = 10;
    hand.pin.disabled = true;
    hand.value = 50;
    hand.fill = am4core.color('white');

    hand.events.on('propertychanged', function(ev) {
      range0.endValue = ev.target.value;
      range1.value = ev.target.value;
      axis2.invalidate();
    });

    setInterval(() => {
      const value = Math.round(Math.random() * 100);
      label.text = value.toString();
      const animation = new am4core.Animation(hand, {
        property: 'value',
        to: value
      }, 1000, am4core.ease.cubicOut).start();
    }, 2000);
  }

  loadMap() {
    this.map.on('load', () => {
      this.map.addSource('earthquakes', {
        'type': 'geojson',
        'data':
          'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
      });

      this.map.addLayer(
        {
          'id': 'earthquakes-heat',
          'type': 'heatmap',
          'source': 'earthquakes',
          'maxzoom': 9,
          'paint': {
            // Increase the heatmap weight based on frequency and property magnitude
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              0,
              0,
              6,
              1
            ],
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              1,
              9,
              3
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(33,102,172,0)',
              0.2,
              'rgb(103,169,207)',
              0.4,
              'rgb(209,229,240)',
              0.6,
              'rgb(253,219,199)',
              0.8,
              'rgb(239,138,98)',
              1,
              'rgb(178,24,43)'
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              2,
              9,
              20
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              1,
              9,
              0
            ]
          }
        },
        'waterway-label'
      );

      this.map.addLayer(
        {
          'id': 'earthquakes-point',
          'type': 'circle',
          'source': 'earthquakes',
          'minzoom': 7,
          'paint': {
            // Size circle radius by earthquake magnitude and zoom level
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
              16,
              ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
            ],
            // Color circle by earthquake magnitude
            'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'mag'],
              1,
              'rgba(33,102,172,0)',
              2,
              'rgb(103,169,207)',
              3,
              'rgb(209,229,240)',
              4,
              'rgb(253,219,199)',
              5,
              'rgb(239,138,98)',
              6,
              'rgb(178,24,43)'
            ],
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            // Transition from heatmap to circle layer by zoom level
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7,
              0,
              8,
              1
            ]
          }
        },
        'waterway-label'
      );
    });
  }

}
