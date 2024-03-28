// TODO: not using below as for some reason fetch does not complete to baselime when deploying grafbase..
// grafbase in Q4 promised ability to ingest their logs, so will use that
// to upload all logs directly into baselime, without using the http api below
// below code is just instructive in case we decide to come back to logging directly to baselime
// if we figure out why fetch is not completing, it would add latency though on fetches so best to just use grafbase logs
// and ingest them into baselime

export async function log(
  resolver: string,
  message: any,
  additionalMessage?: string | Record<string, any>
) {
  console.log(message, additionalMessage)
  if (process.env.ENV !== "prod" && process.env.ENV !== "staging") {
    return
  }
  let url
  if (process.env.ENV === "staging") {
    url = `https://events.baselime.io/v1/staging-grafbase/logs/{${resolver}`
  } else {
    url = `https://events.baselime.io/v1/grafbase/logs/${resolver}`
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.BASELIME_API_KEY!
    },
    body: JSON.stringify([{ message, additionalMessage }])
  }
  await fetch(url, requestOptions)
}

export async function logError(
  resolver: string,
  error: any,
  additionalMessage?: string | Record<string, any>
) {
  console.log(error, additionalMessage)
  if (process.env.ENV !== "prod" && process.env.ENV !== "staging") {
    return
  }
  let url
  if (process.env.ENV === "staging") {
    url = `https://events.baselime.io/v1/staging-grafbase/errors/{${resolver}`
  } else {
    url = `https://events.baselime.io/v1/grafbase/errors/${resolver}`
  }

  if (typeof error === "object") {
    error = Object.assign(
      {
        message: error.message,
        stack: error.stack
      },
      error
    )
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.BASELIME_API_KEY!
    },
    body: JSON.stringify([{ error, additionalMessage }])
  }
  await fetch(url, requestOptions)
}
