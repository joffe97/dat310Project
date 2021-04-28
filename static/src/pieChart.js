let pieC = {
    props: ["pieData"],
    template: /*html*/`
        <div class="pie-chart" :style="pieChartStyle"></div>
    `,
    computed: {
        pieChartStyle() {
            let sum = 0;
            let styles = this.pieData.map(
                pieSection => `${pieSection.color} 0 ${sum += pieSection.value}%`
            )
            return {
                background: 'conic-gradient('+ styles.join(",") + ')'
            }
        }
    }
}