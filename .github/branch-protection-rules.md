# Branch Protection Rules

Краткая памятка для maintainers по настройке branch protection / rulesets в GitHub.

## Что реалистично сейчас

- Сейчас у проекта один явный maintainer: `@im-heimu`.
- CI пока не настроен.
- Поэтому branch protection должна оставаться лёгкой и не изображать процесс, которого в репозитории пока нет.

## Простая модель веток

| Ветка | Назначение | Откуда создаётся | Куда merge |
| --- | --- | --- | --- |
| `master` | основная защищённая стабильная ветка | постоянная рабочая ветка | сюда идут merge-ready изменения |
| `feature/<short-desc>` | обычная задача | от `master` | в `master` |
| `hotfix/<short-desc>` | срочное исправление | от `master` | в `master` |

Релизы на текущем этапе проще отмечать тегами. Постоянная `develop` ветка и отдельные `release/*` ветки пока не нужны.

## Практичная настройка для `master`

- protected branch / ruleset для `master`
- merge только через PR
- direct push запрещён
- включить `Require linear history`
- включить только `Rebase merge`
- отключить `Merge commits`
- `Require conversation resolution before merging` можно включить, если не мешает мелким PR
- `1 approval` можно включить, если это удобно для текущего режима работы

## Что можно включить позже

- required status checks, когда появится CI
- более строгий approval policy, когда появятся дополнительные reviewers
- `Require review from Code Owners`, если это станет полезно при нескольких maintainers
- `Dismiss stale pull request approvals when new commits are pushed`
- `Require branches to be up to date before merging`

## Что включить в GitHub, когда появится CI

Минимум:

- backend validation
- frontend build
- docker compose config check

После этого:

- отметить эти checks как required для `master`

## CODEOWNERS

Текущий `CODEOWNERS` завязан на одного maintainer. Если появятся новые maintainers или отдельные владельцы областей, обновите `CODEOWNERS` одновременно с branch rules.
