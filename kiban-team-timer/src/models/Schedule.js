export class Schedule {

    constructor() {
    this.timerConfigJson = {
        "schedule": [
          { "time": "13:43", "event-name": "スプリント開始" },
          { "time": "13:44", "event-name": "1分レポート書いてね" },
          { "time": "13:45", "event-name": "スプリント終了" }
        ],
        "music": {
          "スプリント開始": "sprint-start.mp3",
          "1分レポート書いてね": "sprint-start.mp3",
          "スプリント終了": "sprint-start.mp3"
        },
        "ntp-server-urls": [
          "http://ntp-a1.nict.go.jp/cgi-bin/json",
          "http://ntp-b1.nict.go.jp/cgi-bin/json"
        ]
    }
}

    getNextEvents(hour, minute) {
        const now = hour * 100 + minute
        return this.timerConfigJson.schedule.filter( x =>
            Number.parseInt(x.time.replace(':', '')) > now
        )
    }
    getMusic(eventName) {
      return this.timerConfigJson.music[eventName]
    }
    
    

}
