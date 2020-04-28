import "bootstrap";

new Vue({
    el: '#app',
    data: {
        hide_filters: false,
        fields_disabled: false,
        calculation_has_completed: false,
        show_advanced_filters: false,
        show_mana_production_averages: false,
        show_advanced_filter_results_flag: false,
        cards_in_deck: 99,
        total_cards_drawn: 0,
        show_details: [],
        results: [],
        copy_count: {
            lands: 0,
            artifacts: 0,
            dorks: 0,
        },
        color_production_totals: {
            lands: {
                white: 0,
                blue: 0,
                black: 0,
                red: 0,
                green: 0,
                colorless: 0
            },
            artifacts: {
                white: 0,
                blue: 0,
                black: 0,
                red: 0,
                green: 0,
                colorless: 0
            },
            dorks: {
                white: 0,
                blue: 0,
                black: 0,
                red: 0,
                green: 0,
                colorless: 0
            }
        },
        color_production_averages: {
            lands: {
                white: 0,
                blue: 0,
                black: 0,
                red: 0,
                green: 0,
                colorless: 0
            },
            artifacts: {
                white: 0,
                blue: 0,
                black: 0,
                red: 0,
                green: 0,
                colorless: 0
            },
            dorks: {
                white: 0,
                blue: 0,
                black: 0,
                red: 0,
                green: 0,
                colorless: 0
            }
        }
    },
    created() {

    },
    methods: {
        toggleFilterDisplay() {
            this.hide_filters = !this.hide_filters;
        },
        toggleManaProductionValues() {
            this.show_mana_production_averages = !this.show_mana_production_averages;
        },
        toggleAdvancedFilters() {
            this.show_advanced_filters = !this.show_advanced_filters;
        },
        toggleDetails(key) {
            this.show_details[key] = Vue.set(this.show_details, key, !this.show_details[key]);
        },
        calculatePercentPerDraw() {
            // Calculate the probability for the current draw
            if (this.total_cards_drawn === 0) {
                // The first time calculating the probability calculate it for an opening hand of 7
                this.total_cards_drawn = 7;

                // Calculate mana-production averages
                this.calculateManaProductionAverages();

                // Hide the filters for better result-viewing
                this.hide_filters = true;
            }

            let cards_drawn = this.total_cards_drawn;
            let result_arr = [];

            result_arr["cards_drawn"] = this.total_cards_drawn;
            for (let property in this.copy_count) {
                result_arr[property] = [];
                result_arr["average_" + property] = 0;
                for (let j = 1; j <= 10; j++) {
                    let current_result = 1 - this.hyp(j - 1, cards_drawn, parseInt(this.copy_count[property]), parseInt(this.cards_in_deck));

                    if (current_result < 1e-6) {
                        current_result = 0;
                    }

                    // Since we aren't calculating for 0 cards drawn, reset array to normal indexes
                    let rounded_result = (current_result * 100).toFixed(2);
                    result_arr[property][j - 1] = rounded_result;

                    if (rounded_result > 50) {
                        result_arr["average_" + property] = j;
                    }
                }
            }

            this.results.push(result_arr);
            this.show_details.push(false);

            this.total_cards_drawn++;
            if (this.fields_disabled === false) {
                this.fields_disabled = true;
            }

            this.calculation_has_completed = true;
        },
        calculateManaProductionAverages() {
            // Calculates the average that each mana source of its type can produce each type of mana
            // This only is relevant if the user filled in the Advanced Fields
            for (let type in this.color_production_totals) {
                for (let color in this.color_production_totals[type]) {
                    if (parseInt(this.color_production_totals[type][color]) > 0) {
                        this.show_advanced_filter_results_flag = true;
                        this.color_production_averages[type][color] = ((parseInt(this.color_production_totals[type][color]) / parseInt(this.copy_count[type])) * 100).toFixed(2)
                    }
                }
            }
        },
        hyp(x, cards_drawn, total_copies, deck_size) {
            // Calculation formula derived from https://gist.github.com/adamnovak/f34e6cf2c08684752a9d
            let smaller_set,
                larger_set;

            // Make sure copies is fewer than cards drawn
            if (total_copies < cards_drawn) {
                smaller_set = total_copies;
                larger_set = cards_drawn
            } else {
                smaller_set = cards_drawn;
                larger_set = total_copies;
            }

            let h = 1,
                s = 1,
                k = 0,
                i = 0;

            // Refer to Gist above for deeper explanation on how this calculation works
            while (i < x) {
                while (s > 1 && k < smaller_set ) {
                    h = h * (1 - larger_set / (deck_size - k));
                    s = s * (1 - larger_set / (deck_size - k));
                    k = k + 1;
                }
                h = h * (smaller_set - i) * (larger_set - i) / (i + 1) / (deck_size - smaller_set - larger_set + i + 1);
                s = s + h;
                i = i + 1;
            }
            while (k < smaller_set ) {
                s = s * (1 - larger_set / (deck_size - k));
                k = k + 1;
            }

            return s;
        }
    }
});