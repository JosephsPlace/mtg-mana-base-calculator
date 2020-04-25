import "bootstrap";

new Vue({
    el: '#app',
    data: {
        button_text: 'Calculate',
        fields_disabled: false,
        cards_in_deck: 99,
        copy_count: {
            lands: 0,
            artifacts: 0,
            dorks: 0,
        },
        total_cards_drawn: 0,
        results: []
    },
    created() {

    },
    methods: {
        calculatePercentPerDraw() {
            if (this.total_cards_drawn === 0) {
                this.total_cards_drawn = 7;
            }
            let cards_drawn = this.total_cards_drawn;
            let result_arr = [];

            result_arr["cards_drawn"] = this.total_cards_drawn;
            for (let property in this.copy_count) {
                result_arr[property] = [];
                for (let j = 1; j <= 10; j++) {
                    let current_result = 1 - this.hyp(j - 1, cards_drawn, parseInt(this.copy_count[property]), parseInt(this.cards_in_deck));

                    if (current_result < 1e-6) {
                        current_result = 0;
                    }

                    // Since we aren't calculating for 0 cards drawn, reset array to normal indexes
                    result_arr[property][j - 1] = current_result;
                }
            }

            this.results.push(result_arr)
            this.total_cards_drawn++;
            if (this.fields_disabled === false) {
                this.fields_disabled = true;
            }
        },
        hyp(x, cards_drawn, total_copies, deck_size) {
            let nz, mz;

            // Make sure copies is fewer than cards drawn
            if (total_copies < cards_drawn) {
                nz = total_copies;
                mz = cards_drawn
            } else {
                nz = cards_drawn;
                mz = total_copies
            }

            let h = 1,
                s = 1,
                k = 0,
                i = 0;
            while (i < x) {
                while (s > 1 && k < nz) {
                    h = h * (1 - mz / (deck_size - k));
                    s = s * (1 -mz / (deck_size - k));
                    k = k + 1;
                }
                h = h * (nz - i) * (mz - i) / (i + 1) / (deck_size - nz - mz + i + 1);
                s = s + h;
                i = i + 1;
            }
            while (k < nz) {
                s = s * (1 - mz / (deck_size - k));
                k = k + 1;
            }

            return s;
        }
    }
});