(function() {
  'use strict';
  angular.
    module('core.annotationChart').
    directive('annotationChart', annotationChartFactory);

  annotationChartFactory.$inject = ['$timeout', '$window'];
  function annotationChartFactory($timeout, $window) {
    return {
      restrict: 'EA',
      scope: {
        quotes: '='
      },
      link
    };
    //////////////////////////////////////////////////

    function link(scope, elem, attr) {
      triggerDraw();
      scope.$watch('quotes', triggerDraw, true);
      angular.element($window).on('resize', triggerDraw);

      const chartDiv = angular.element('<div>');
      chartDiv.addClass('stock-chart');
      elem.append(chartDiv);

      let timer;
      const delay = 20;
      function triggerDraw() {
        $timeout.cancel(timer);
        timer = $timeout(function() {
          $window.google.charts.setOnLoadCallback(drawChart);
        }, delay);
      }

      function drawChart() {
        const data = new $window.google.visualization.DataTable();
        const columns = Object.keys(scope.quotes).
          filter((key) => scope.quotes.hasOwnProperty(key));

        if(columns.length === 0) {
          return;
        }

        data.addColumn('date', 'Date');
        columns.forEach((col) => data.addColumn('number', col));

        const dataByDate = groupByDate(scope.quotes);
        const rows = createRows(dataByDate, columns);
        data.addRows(rows);

        const chart = new $window.google.visualization.
          AnnotationChart(chartDiv[0]);

        const options = {
          fill: 10
        };

        chart.draw(data, options);
      }

      function groupByDate(data) {
        const groupedData = {};

        for(const symbol in data) {
          if(data.hasOwnProperty(symbol)) {
            const quotes = data[symbol];
            for(const quote of quotes) {
              if(!groupedData[quote.date]) groupedData[quote.date] = {};
              groupedData[quote.date][symbol] = parseFloat(quote.price);
            }
          }
        }

        return groupedData;
      }

      function createRows(dataByDate, columns) {
        const rows = [];
        const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
        const lastValue = {};

        for(const dateString in dataByDate) {
          if(dataByDate.hasOwnProperty(dateString)) {
            try {
              const [, yyyy, mm, dd] = dateString.match(dateRegex);
              const row = [];
              row.push(new Date(+yyyy, +mm - 1, +dd));
              for(const column of columns) {
                // fill the gaps in the graph due to differences
                // in holidays across exchanges
                const value = dataByDate[dateString][column] ||
                  lastValue[column];
                row.push(value);
                lastValue[column] = value;
              }
              rows.push(row);
            } catch(e) {
              console.error(e);
            }
          }
        }

        return rows;
      }
    }
  }
}());
