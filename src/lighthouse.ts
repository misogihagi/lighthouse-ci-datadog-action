import * as core from '@actions/core';
import { client, v2 } from '@datadog/datadog-api-client';

const METRIC_TYPE = 3;
const EXPECTED_RESPONSE_CODE = 'NO_ERROR';

function getNumericAuditValue(data:any, attribute:string) {
  const code = data?.runtimeError?.code;
  if (code == EXPECTED_RESPONSE_CODE) {
    const errCode = data?.runtimeError?.code;
    const errMsg = data?.runtimeError?.message;
    core.warning(
      `not collecting lighthouse metrics runtimeError code ${errCode} message ${errMsg}`,
    );
    return null;
  }
  return data.audits[attribute].numericValue;
}

export function generateSeries(data:any, tags?:string[]) {
  const score_accessibility = Math.round((data.categories?.accessibility?.score || 0) * 100);
  const score_best_practices = Math.round((data.categories?.['best-practices']?.score || 0) * 100);
  const score_performance = Math.round((data.categories?.performance?.score || 0) * 100);
  const score_pwa = Math.round((data.categories?.pwa?.score || 0) * 100);
  const score_seo = Math.round((data.categories?.seo?.score || 0) * 100);
  const largest_contentful_paint = getNumericAuditValue(data, 'largest-contentful-paint');
  const first_contentful_paint = getNumericAuditValue(data, 'first-contentful-paint');
  const cumulative_layout_shift = getNumericAuditValue(data, 'cumulative-layout-shift');
  const max_potential_fid = getNumericAuditValue(data, 'max-potential-fid');
  const time_to_interactive = getNumericAuditValue(data, 'interactive');
  const mainthread_work_breakdown = getNumericAuditValue(data, 'mainthread-work-breakdown');
  const unused_javascript = getNumericAuditValue(data, 'unused-javascript');
  const unused_css_rules = getNumericAuditValue(data, 'unused-css-rules');
  const modern_image_formats = getNumericAuditValue(data, 'modern-image-formats');
  const uses_optimized_images = getNumericAuditValue(data, 'uses-optimized-images');
  const render_blocking_resources = getNumericAuditValue(data, 'render-blocking-resources');
  const bootup_time = getNumericAuditValue(data, 'bootup-time');
  const server_response_time = getNumericAuditValue(data, 'server-response-time');
  const speed_index = getNumericAuditValue(data, 'speed-index');
  const dom_size = getNumericAuditValue(data, 'dom-size');
  const total_blocking_time = getNumericAuditValue(data, 'total-blocking-time');

  const dict = {
    'lighthouse.accessibility': score_accessibility,
    'lighthouse.best_practices': score_best_practices,
    'lighthouse.performance': score_performance,
    'lighthouse.pwa': score_pwa,
    'lighthouse.seo': score_seo,
    'lighthouse.largest_contentful_paint': largest_contentful_paint,
    'lighthouse.first_contentful_paint': first_contentful_paint,
    'lighthouse.cumulative_layout_shift': cumulative_layout_shift,
    'lighthouse.max_potential_fid': max_potential_fid,
    'lighthouse.time_to_interactive': time_to_interactive,
    'lighthouse.mainthread_work_breakdown': mainthread_work_breakdown,
    'lighthouse.unused_javascript': unused_javascript,
    'lighthouse.unused_css_rules': unused_css_rules,
    'lighthouse.modern_image_formats': modern_image_formats,
    'lighthouse.uses_optimized_images': uses_optimized_images,
    'lighthouse.render_blocking_resources': render_blocking_resources,
    'lighthouse.bootup_time': bootup_time,
    'lighthouse.server_response_time': server_response_time,
    'lighthouse.speed_index': speed_index,
    'lighthouse.dom_size': dom_size,
    'lighthouse.total_blocking_time': total_blocking_time,
  };

  const requestedUrl = data?.requestedUrl;
  const defaultTag = `url:${requestedUrl}`;

  const series = Object.entries(dict).map(([key, value]) => ({
    metric: key,
    type: METRIC_TYPE,
    points: [
      {
        timestamp: Math.round(new Date().getTime() / 1000),
        value,
      },
    ],
    tags: tags ? [defaultTag, ...tags] : [defaultTag],
  }
  ));

  return series;
}

export function submitdMetrics({ data, tags, apiKey }:{ data:any, tags?:string[], apiKey?:string }):void {
  const configuration = client.createConfiguration(apiKey ? {
    authMethods: {
      apiKeyAuth: apiKey,
    },
  } : {});

  const apiInstance = new v2.MetricsApi(configuration);

  const params: v2.MetricsApiSubmitMetricsRequest = {
    body: {
      series: generateSeries(data, tags),
    },
  };

  apiInstance
    .submitMetrics(params)
    .then((data: v2.IntakePayloadAccepted) => {
      core.debug(
        `API called successfully. Returned data: ${JSON.stringify(data)}`,
      );
    })
    .catch((error: any) => core.error(error));
}
