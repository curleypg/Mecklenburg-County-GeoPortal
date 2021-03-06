import jsonToURL from "../js/jsontourl";

let template = `
    <div>
        <div v-if="results && results.length > 0" class="text-center">
            <div class="row" v-if="results[0].jurisdiction !== 'charlotte'">
                <div class="column">
                    <Print></Print>
                    <div class="report-record-highlight">
                        <svg class="icon icon-trash"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-trash"></use></svg>
                        <h2>Your TRASH day is</h2>
                        <h1>{{ results[0].day }}</h1>
                    </div>
                </div>
                <div class="column">
                    <div class="report-record-highlight">
                        <svg class="icon icon-recycle"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-recycle"></use></svg>
                        <h2>Your RECYCLING day is</h2>
                        <h1>
                            {{ results[0].day }} {{ recyclingWeek(results[0].week) }}
                        </h1>
                        <h4>Recycling pickup is every other week.</h4>
                    </div>
                </div>
            </div>

            <div v-if="results && results[0].jurisdiction === 'charlotte'">
                <div class="row">
                    <div class="column">
                        <div class="report-record-highlight">
                            <svg class="icon icon-trash"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-trash"></use></svg>
                            <h2>Your TRASH day is</h2>
                            <h1>{{ results | typeFilter('GARBAGE') | itemFilter('day') }}</h1>
                        </div>
                    </div>
                    <div class="column">
                        <div class="report-record-highlight">
                            <svg class="icon icon-recycle"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-recycle"></use></svg>
                            <h2>Your RECYCLING day is</h2>
                            <h1>{{ results | typeFilter('RECYCLING') | itemFilter('day') }} {{ recyclingWeek(results) }}</h1>
                            <h4>Recycling pickup is every other week ({{ results | typeFilter('RECYCLING') | itemFilter('week')}})</h4>
                        </div>
                    </div>
                </div>
                <table style={tableStyle}>
                    <caption>Other Collection Services</caption>
                    <thead>
                        <tr>
                            <th>Collection Service</th>
                            <th>Day</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                Yard Waste
                            </td>
                            <td>
                                {{ results | typeFilter('YARD WASTE') | itemFilter('day') }}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Bulky Items
                            </td>
                            <td>
                                {{ results | typeFilter('BULKY') | itemFilter('day') }} <br /> Call 311 to schedule.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else class="text-center">
            <div>
                <div class="report-record-highlight">
                    <svg class="icon icon-trash"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-trash"></use></svg>
                    <h2>Unfortunately we only know collection information for Huntersville, Cornelius, Matthews, Pineville, Davidson, Mint Hill and Charlotte. For collection information for you location, please visit you local government web site.</h2>
                </div>
            </div>
        </div>
        <div class="report-moreinfo">
            <h5>For more information, please visit:</h5>
            <ul class="list-unstyled">
                <li><a href="http://charmeck.org/city/charlotte/SWS" target="_blank"  rel="noopener">Charlotte Solid Waste Services</a></li>
                <li><a href="http://www.cornelius.org/index.aspx?nid=208" target="_blank"  rel="noopener">Cornelius Solid Waste Services</a></li>
                <li><a href="http://www.huntersville.org/Departments/EngineeringPublicWorks/SolidWasteRecycling.aspx" target="_blank"  rel="noopener">Huntersville Solid Waste and Recycling Collection</a></li>
                <li><a href="http://www.pinevillenc.gov" target="_blank" rel="noopener">Town of Pineville</a></li>
                <li><a href="http://www.matthewsnc.gov/" target="_blank" rel="noopener">Town of Matthews</a></li>
            </ul>
        </div>
    </div>
`;
// Test information
// 3810 Warrington is orange (odd)
// 5501 Ruth is green (even)

export default {
  name: "trash",
  template: template,
  data: function() {
    return {
      results: []
    };
  },
  watch: {
    "$parent.sharedState.selected.lnglat": "getResults",
    "$parent.sharedState.show": "getResults"
  },
  filters: {
    typeFilter: function(items, val) {
      items = items.filter(function(rec) {
        return rec.type === val;
      });
      return items[0];
    },
    itemFilter: function(item, col) {
      return item[col];
    }
  },
  mounted: function() {
    this.getResults();
  },
  methods: {
    getResults: function() {
      let _this = this;
      if (
        _this.$parent.sharedState.selected.lnglat &&
        _this.$parent.sharedState.show.indexOf("trash") !== -1
      ) {
        let params = {
          geom_column: "the_geom",
          columns: "jurisdiction, day, week, type"
        };
        fetch(
          `https://mcmap.org/api/intersect_point/v1/solid_waste/${_this.$parent.sharedState.selected.lnglat.join(
            ","
          )}/4326?${jsonToURL(params)}`
        )
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            _this.results = data;
          })
          .catch(function(ex) {
            console.log("parsing failed", ex);
          });
      }
    },
    recyclingWeek: function(w) {
      var theDate = new Date();
      if (typeof w == "object") {
        let items = w.filter(function(rec) {
          return rec.type === "RECYCLING";
        });
        w = items[0].week;
      }
      theDate.setHours(0, 0, 0, 0);
      var currentWeek = this.checkOddEven(this.weekNumber(theDate.getTime()));
      var propertyWeek = this.weekEvenOdd(w);
      if (currentWeek === propertyWeek) {
        return "this week";
      } else {
        return "next week";
      }
    },
    weekEvenOdd: function(w) {
      if (w === "A" || w === "GREEN") {
        return "even";
      } else {
        return "odd";
      }
    },
    weekNumber: function(d) {
      // the length of a week
      var one_week = 1000 * 60 * 60 * 24 * 7;
      // the start of a Green or A week
      var a = new Date("2015-08-30").getTime();
      var weekN = Math.floor((d - a) / one_week);
      return weekN;
    },
    checkOddEven: function(num) {
      if (num % 2 === 0) {
        return "even";
      } else {
        return "odd";
      }
    }
  }
};
