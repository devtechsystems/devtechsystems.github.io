import React from 'react'
import ReactDOM from 'react-dom'
import qdFormatters from 'qd-formatters'
import CountUp from 'react-countup'
import Sizebox from 'react-sizebox'
import BreakDownPanel from './components/BreakdownPanel'
import StackedBarChart from './components/StackedBarChart'
import ColorPalette from './util/ColorPalette'
import ColorScale from './util/ColorScale'
import d3 from 'd3'
import lodash from 'lodash'
import * as topojson from 'topojson'
import { PRACTICE_AREA_COLUMN_NAMES } from './ColumnNames'
import { reduceSum, reduceCount } from './util/Reduce'
import D3Choropleth from './components/D3Choropleth'
import ProjectSearch from './components/ProjectSearch'

const formatters = qdFormatters(d3)


// Make sure each record only has one practice area
// We need this in order to group by practice area because the original data can have multiple practice areas per record
const denormalizePracticeAreas = (data) => {
  let denormalizedData = []
  const practiceAreas = Object.values(PRACTICE_AREA_COLUMN_NAMES)
  practiceAreas.forEach((practiceArea) => {
    const dataFilteredByPracticeArea = data.filter(d => d[practiceArea['key']] === 'x')
    const dataWithSinglePracticeArea = dataFilteredByPracticeArea.map(d => Object.assign(d, { denormalizedPracticeArea: practiceArea['displayName']}))
    denormalizedData = denormalizedData.concat(dataWithSinglePracticeArea)
  })
  let nonePracticeAreas = data.filter(d => {
    var foundSomePracticeArea = practiceAreas.some((practiceArea) => d[practiceArea['key']] === 'x')
    return !foundSomePracticeArea
  })
  .map(d => Object.assign(d, { denormalizedPracticeArea: 'None' }))

  return denormalizedData.concat(nonePracticeAreas)
}

const chartDataFormat = (groupedValues) => {
  const nameValueArray = Object.entries(groupedValues).map(([name, value]) => ({ name, value }))
  return lodash.sortBy(nameValueArray, ['value']).slice(0).reverse()
}

import { regionAndPracAreas, practiceAreas } from './test/Data'

document.addEventListener('DOMContentLoaded', () => {
  const data = JEKYLL_DATA.projectsData
  const totalProjects = data.length
  const totalPartners = Object.keys(lodash.groupBy(data, 'Client/Donor')).length
  const totalMoney = formatters.bigCurrencyFormat(data.reduce((acc, next) => {
    const contractValue = Number(next['Contract Value USD'])
    if(isNaN(contractValue)) return acc
    return acc + Number(next['Contract Value USD'])
  }, 0))
  const projectsGroupedByCountry = lodash.groupBy(data, 'Country')
  const totalCountries = Object.keys(projectsGroupedByCountry).length
  const projectsGroupedByRegion = lodash.groupBy(data, 'Region')
  const countriesInRegions = lodash.mapValues(projectsGroupedByRegion, (projects) => lodash.uniqBy(projects, 'Country').length)
  const projectsGroupedByPracticeArea = lodash.groupBy(denormalizePracticeAreas(data), 'denormalizedPracticeArea')
  const testGroupRegions = lodash.groupBy(regionAndPracAreas, 'region')
  const practiceAreaSumsForRegions = lodash.mapValues(testGroupRegions, (projGroup) => {
    // const denormalized = denormalizePracticeAreas(projGroup)
    const groupedByPracticeAreas = lodash.groupBy(projGroup, (project) => project.practiceArea)
    const contractValuesForGroupedPracticeAreas = reduceSum(groupedByPracticeAreas, 'value')

    return contractValuesForGroupedPracticeAreas
  })
  const flattenedPracticeAreaSums = Object.entries(practiceAreaSumsForRegions).map(([regionName, groupedPracticeAreaSums]) => Object.assign({ region: regionName }, groupedPracticeAreaSums))

  const choroplethData = chartDataFormat(reduceCount(projectsGroupedByCountry))
  const getCountryColor = (datum) => {
    return ChoroplethColorScale.getColorFor(datum.value)
  }
  const ChoroplethColorScale = new ColorScale(choroplethData, ColorPalette.colors, ColorPalette.noDataColor)
  d3.json("/assets/data/countries.topo.json", function(error, world) {

    const countriesTopo = topojson.feature(world, world.objects.countries).features;

    const projectsChoropleth = D3Choropleth('projects-choropleth')
      .topojson(countriesTopo)
      .data(choroplethData)
      .colorPalette(ColorPalette)
      .tooltipContent((datum) => `${datum.name}<br/>${datum.value} projects`)
      .numberFormatter(formatters.numberFormat)
      .draw()
  });

  const pbpaPanel = (
    <BreakDownPanel
      data={chartDataFormat(reduceCount(projectsGroupedByPracticeArea))}
      bigNumber={totalProjects}
      colorPalette={ColorPalette}
      title='Projects'
      groupTitle='Practice Area'
    />
  )
  const pbrPanel = (
    <BreakDownPanel
      data={chartDataFormat(countriesInRegions)}
      bigNumber={totalCountries}
      colorPalette={ColorPalette}
      title='Countries'
      groupTitle='Region'
    />
  )

  const stackedBarChart = (
    <Sizebox className="stacked-bar-chart-sizebox">
      <StackedBarChart
        data={regionAndPracAreas}
        xAxisDataKey={'region'}
        stackDataKey={'practiceArea'}
        colorPalette={ColorPalette}
        valueKey={'value'}
        tickFormatter={formatters.bigCurrencyFormat}
        tooltipValueFormatter={formatters.currencyFormat}
      />
    </Sizebox>
  )

  ReactDOM.render(
    <CountUp start={0} end={totalProjects} duration={3} />,
    document.getElementById('projects-count')
  )

  ReactDOM.render(
    <CountUp start={0} end={totalCountries} duration={3} />,
    document.getElementById('countries-count')
  )

  ReactDOM.render(
    <CountUp start={0} end={totalPartners} duration={3} />,
    document.getElementById('partners-count')
  )

  ReactDOM.render(
    <CountUp start={0} end={totalCountries} duration={3} />,
    document.getElementById('countries-count')
  )

  ReactDOM.render(
    <span>{totalMoney}</span>,
    document.getElementById('total-money')
  )

  ReactDOM.render(
    pbpaPanel,
    document.getElementById('projects-by-practice-area')
  )

  ReactDOM.render(
    pbrPanel,
    document.getElementById('projects-by-region')
  )

  ReactDOM.render(
    stackedBarChart,
    document.getElementById('contract-value')
  )

  ReactDOM.render(
    <ProjectSearch projects={data} />,
    document.getElementById('project-search')
  )

})
