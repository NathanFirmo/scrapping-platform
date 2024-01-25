package runner

import (
	"github.com/NathanFirmo/scrapping-platform/worker/internal/db"
	"github.com/gocolly/colly"
	log "github.com/inconshreveable/log15"
	"github.com/robfig/cron"
	"time"
)

var srvlog = log.New("service", "scrapper")

type WebSite struct {
	Url        string `bson:"url,omitempty"`
	Title      string `bson:"title,omitempty"`
	Descripton string `bson:"descripton,omitempty"`
}

type RunnerExecution struct {
	Date    string `bson:"date,omitempty"`
	Keyword string `bson:"keyword,omitempty"`
}

type Runner struct {
	Collector      *colly.Collector
	Cron           *cron.Cron
	CronExpression string
	Keyword        string
}

func (r *Runner) Run() {
	r.Collector.Visit("https://www.google.com.br/search?q=" + r.Keyword)
	db.SaveExecution(RunnerExecution{
		Keyword: r.Keyword,
		Date:    time.Now().Format("2006-01-02 15:04:05"),
	})
}

func (r *Runner) UpdateKeyword(k string) {
	srvlog.Info("Updating keyword", "from", r.Keyword, "to", k)
	r.Keyword = k

	db.SaveConfigChange(struct {
		CronExpression string `bson:"cronExpression,omitempty"`
		Keyword        string `bson:"keyword,omitempty"`
	}{
		CronExpression: r.CronExpression,
		Keyword:        r.Keyword,
	})

	r.Run()
}

func (r *Runner) UpdateCron(i string) {
	srvlog.Info("Updating cron", "from", r.CronExpression, "to", i)

	r.CronExpression = i

	db.SaveConfigChange(struct {
		CronExpression string `bson:"cronExpression,omitempty"`
		Keyword        string `bson:"keyword,omitempty"`
	}{
		CronExpression: r.CronExpression,
		Keyword:        r.Keyword,
	})

	r.Cron.Stop()
	r.Cron = cron.New()
	r.Cron.AddFunc(r.CronExpression, func() {
		r.Run()
	})
	r.Cron.Start()
}

func Create() *Runner {
	c := colly.NewCollector()
	cron := cron.New()

	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		srvlog.Info("On HTML")
		title := e.ChildText("div div h3")

		if title == "" {
			return
		}

		srvlog.Info("Saving document", "title", title)

		db.SaveDocument(WebSite{
			Url:        e.Attr("href"),
			Title:      title,
			Descripton: e.DOM.Parent().Next().Text(),
		})
	})

	c.OnRequest(func(r *colly.Request) {
		srvlog.Info("Visiting url " + r.URL.String())
	})

	r := &Runner{
		Collector:      c,
		Keyword:        "golang",
		CronExpression: "0 * * * *",
		Cron:           cron,
	}

	db.SaveConfigChange(struct {
		CronExpression string "bson:\"cronExpression,omitempty\""
		Keyword        string "bson:\"keyword,omitempty\""
	}{
		CronExpression: r.CronExpression,
		Keyword:        r.Keyword,
	})

	r.Cron.AddFunc(r.CronExpression, func() {
		r.Run()
	})

	cron.Start()

	r.Collector.Visit("https://www.google.com.br/search?q=" + r.Keyword)

	return r
}
