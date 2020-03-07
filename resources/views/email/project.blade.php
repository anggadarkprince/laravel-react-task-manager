<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body>
<style>
    body,
    body *:not(html):not(style):not(br):not(tr):not(code) {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        box-sizing: border-box;
    }

    body {
        background-color: #f8fafc;
        color: #74787e;
        height: 100%;
        hyphens: auto;
        line-height: 1.4;
        margin: 0;
        -moz-hyphens: auto;
        -ms-word-break: break-all;
        width: 100% !important;
        -webkit-hyphens: auto;
        -webkit-text-size-adjust: none;
        word-break: break-all;
        word-break: break-word;
    }
    p,
    ul,
    ol,
    blockquote {
        line-height: 1.4;
        text-align: left;
    }

    a {
        color: #3869d4;
    }
    @media only screen and (max-width: 600px) {
        .inner-body {
            width: 100% !important;
        }

        .footer {
            width: 100% !important;
        }
    }

    @media only screen and (max-width: 500px) {
        .button {
            width: 100% !important;
        }
    }
</style>
<table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
    <!-- Body content -->
    <tr>
        <td><h3>Project Created</h3></td>
    </tr>
    <tr>
        <td class="content-cell">
            <div>
                Hi, recently you create new project :
                <p><strong>{{ $project->name }}</strong></p>
                <p>{{ $project->description }}</p>
            </div>
        </td>
    </tr>
</table>
</body>
