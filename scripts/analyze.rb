#! /usr/bin/env ruby


shas = `git log --pretty=format:"%H"`.split("\n")

data = []

shas.each do |sha|
  commit = {sha: sha}

  commit_msg = `git show --pretty=format:"%B" #{sha}`.strip
  co_authored = !!commit_msg.match(/Co-Authored-By: (Claude|GPT)/i)
  if co_authored
    commit[:co_authored] = true
  else
    commit[:co_authored] = false
  end

  stats = `git show --pretty="" --numstat #{sha}`.strip
  useable_stats = stats.split("\n").select do |line|
    !(line.match(/.geojson/) ||line.match(/yarn.lock/))
  end

  total_added = useable_stats.map{ |file| file.split("\t") }.map{ |a| a[0].to_i }.sum
  total_deleted = useable_stats.map{ |file| file.split("\t") }.map{ |a| a[1].to_i }.sum

  commit[:total_added] = total_added
  commit[:total_deleted] = total_deleted
  commit[:files_changed] = useable_stats.length

  puts sha
  puts co_authored
  puts useable_stats

  data << commit
end

human_changes = data.select{ |commit| !commit[:co_authored] }.map { |commit| commit[:total_added] + commit[:total_deleted] }.sum
ai_changes = data.select{ |commit| commit[:co_authored] }.map { |commit| commit[:total_added] + commit[:total_deleted] }.sum

puts "\nResults\n"
pp({
  human_changes: human_changes,
  ai_changes: ai_changes,
  total_changes: human_changes + ai_changes,
  ai_proportion: ai_changes.to_f / (human_changes + ai_changes),
  human_proportion: human_changes.to_f / (human_changes + ai_changes)
})