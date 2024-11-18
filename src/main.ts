import * as core from '@actions/core';
import { glob } from 'glob';
import { submitdMetrics } from './lighthouse';

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  // https://github.com/DataDog/integrations-extras/blob/master/lighthouse/datadog_checks/lighthouse/lighthouse.py
  try {
    const apiKey: string = core.getInput('dd-api-key');
    const data = await retrieveData();
    data.forEach((metrics) => {
      if (metrics)submitdMetrics({ data: metrics, tags: [], apiKey });
    });
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}

async function retrieveData():Promise<any[]> {
  const jsons = await glob('./.lighthouseci/lhr*.json');

  return jsons.map((json) => {
    let data = null;
    try {
      data = JSON.parse(json);
    } catch {
      core.warning('lighthouse response JSON different than expected');
    }
    return data;
  });
}
