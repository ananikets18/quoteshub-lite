@extends('layouts.app')
@section('title', 'Dashboard')
@section('content')
<div class='container mx-auto px-4 py-8'><h1 class='text-2xl font-bold'>Dashboard</h1><p>Stats: {{ json_encode($stats) }}</p></div>
@endsection